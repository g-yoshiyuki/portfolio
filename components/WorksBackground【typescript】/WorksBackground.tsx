import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const WorksBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    //サイズ
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    //シーン
    const scene = new THREE.Scene();
    //カメラ
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(1, 1, 2);

    //レンダラー
    const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(sizes.width, sizes.height);
    // 上記のコードでは、ビューポート全体をサイズとするので以下のコードで独自に指定する
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    // document.body.appendChild(renderer.domElement);
    // 上記のコードでは<body>タグ直下にcanvasが追加されページ全体に描画されてしまう
    if (!mountRef.current.firstChild) {
      mountRef.current.appendChild(renderer.domElement);
    }


    // 背景色の設定
    renderer.setClearColor(0x111111); // 16進数で色を指定

    /**ジオメトリ**/
    // (オブジェクトの形状と位置情報が入ったデータ)
    // BufferGeometryは処理性能に優れているので数の多いパーティクルを生成する時に有効
    const particlesGeometry = new THREE.BufferGeometry();
    // パーティクルを1000個つくる
    const count = 1000;
    //パーティクルのサイズを設定する配列を作成
    const sizeArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // ここで指定した値の範囲の大きさで生成される。
      // 例えばsizeArray[i] = 10;とするとすべて10のサイズになる
      sizeArray[i] = Math.random() * 0.01 + 0.04;
    }
    particlesGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizeArray, 1)
    );
    // 位置情報の配列をつくる。*3はx，y，zのこと
    const positionArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    // パーティクルで使用したい色を指定
    const colors = ["#C3EED7", "#E7FAEC", "#efefef"];

    for (let i = 0; i < count * 3; i++) {
      // 0.5とすることで座標軸の中心に持ってくることができる。
      // * 20 の値を小さくすることでパーティクルが配置される範囲を狭める。
      positionArray[i] = (Math.random() - 0.5) * 20;
    }
    // colorsで指定した色をランダムに割り当てる
    for (let i = 0; i < count; i++) {
      const color = new THREE.Color(
        colors[Math.floor(Math.random() * colors.length)]
      );
      colorArray[i * 3] = color.r; // R
      colorArray[i * 3 + 1] = color.g; // G
      colorArray[i * 3 + 2] = color.b; // B
    }

    // パーティクルが流れ星であるかどうかを表す配列を作成
    const starArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // 全体の何%のパーティクルを流れ星にするか設定
      starArray[i] = Math.random() < 0.03 ? 1.0 : 0.0;
    }
    particlesGeometry.setAttribute(
      "star",
      new THREE.Float32BufferAttribute(starArray, 1)
    );
    // 上記の設定をセットする
    // position
    particlesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positionArray, 3)
    );
    // color
    particlesGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorArray, 3)
    );
    //シェーダーマテリアル
    const pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // カメラからの距離によってパーティクルのサイズを変化させる
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Create a circular shape instead of hexagonal
          vec2 coord = 2.0 * gl_PointCoord - 1.0;
          if(length(coord) > 1.0){
            discard;
          }
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
      blending: THREE.AdditiveBlending, // 重なったパーティクルを光らせる
      depthTest: false, // パーティクルの重なり順に問題がある場合はこれを無効にする
      transparent: true, // パーティクルが透明になるようにする
      vertexColors: true, // 頂点の色を使用
    });

    // メッシュ化
    // (x,y,zの3点情報をもとに、3Dオブジェクトをつくること)
    const particles = new THREE.Points(particlesGeometry, pointsMaterial);
    scene.add(particles);

    //マウス操作
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false; //スクロールでカメラアングル変更を無効化
    window.addEventListener("resize", onWindowResize);
    const clock = new THREE.Clock();

    // 値を小さくするほど回転のアニメーションが遅くなる。
    const speedFactor = 0.03;

    // 流れ星が動き始めるまでの待ち時間を表す配列
    const delayArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // ランダムな待ち時間を設定します (この場合、最大4秒)
      delayArray[i] = Math.random() * 4;
    }
    particlesGeometry.setAttribute(
      "delay",
      new THREE.Float32BufferAttribute(delayArray, 1)
    );

    let animationFrameId: number | undefined;

    function animate() {
      const elapsedTime = clock.getElapsedTime();

      let positionAttribute = particles.geometry.getAttribute("position");
      let starArray = Array.from(particles.geometry.getAttribute("star").array);
      let delayArray = Array.from(
        particles.geometry.getAttribute("delay").array
      );

      for (let index = 0; index < positionAttribute.count; index++) {
        if (starArray[index] === 1.0) {
          if (elapsedTime > delayArray[index]) {
            let zPosition = positionAttribute.getZ(index);
            zPosition += 1;
            if (zPosition > 10) {
              zPosition -= 20;
              delayArray[index] = elapsedTime + 1 + Math.random() * 4;
            }
            positionAttribute.setZ(index, zPosition);
          }
        }
      }

      positionAttribute.needsUpdate = true;
      camera.position.x = Math.cos(elapsedTime * speedFactor) * 2;
      camera.position.z = Math.sin(elapsedTime * speedFactor) * 2;
      camera.lookAt(scene.position);
      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    //ブラウザのリサイズに対応
    function onWindowResize() {
      if (!mountRef.current) return;
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
    }
    animate();

    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
  return <div ref={mountRef} className="worksBackground"></div>;
};

export default WorksBackground;
