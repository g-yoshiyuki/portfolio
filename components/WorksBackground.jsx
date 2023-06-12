import React, { useEffect, useRef } from "react";
// resizeイベントはdebounceを使って最適化するとパフォーマンスが上がる
import { debounce } from 'lodash';
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const WorksBackground = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    // .worksBackgroundの高さと横幅を取得
    const parentElement = mountRef.current;
    const sizes = {
      width: parentElement.clientWidth,
      height: parentElement.clientHeight,
    };
    //シーン
    const scene = new THREE.Scene();
    //カメラ
    const camera = new THREE.PerspectiveCamera(
      // 以下の数値を上げることで視野度が広がる
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    // x，y,zの順番。例えば3つ目の数値を上げることでカメラは引きになる。
    camera.position.set(1, 1, 2);

    //レンダラー
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    // renderer.setPixelRatio(window.devicePixelRatio);
    // 上記だと高解像度のパソコンで負荷が高くなる。以下はドットを1ピクセルを指定
    renderer.setPixelRatio(1);
    // document.body.appendChild(renderer.domElement);
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
      sizeArray[i] = Math.random() * 0.01 + 0.03;
    }
    particlesGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizeArray, 1)
    );
    // 位置情報の配列をつくる。*3はx，y，zのこと
    const positionArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    // パーティクルで使用したい色を指定
    const colors = ["#C3EED7", "#E7FAEC", "#ffffff"];

    for (let i = 0; i < count * 3; i++) {
      // 0から1の値を設定する。
      // 0.5とすることで座標軸の中心に持ってくることができる。画面いっぱいにパーティクルを広げたい時に指定する。
      // * 20 の値を小さくすることでパーティクルが配置される範囲を狭める。
      // particles.geometry.attributes.position.array[index]の値を揃える必要がある。
      positionArray[i] = (Math.random() - 0.5) * 15;
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
      starArray[i] = Math.random() < 0.05 ? 1.0 : 0.0;
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

    //マウス操作(ユーザーがマウス操作でカメラアングルを変更する場合以下の記述が必要)
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.enableZoom = false; //スクロールでカメラアングル変更を無効化

    window.addEventListener("resize", onWindowResize);
    const clock = new THREE.Clock();

    // 値を小さくするほど回転のアニメーションが遅くなる。
    const speedFactor = 0.03;

    // 流れ星が動き始めるまでの待ち時間を表す配列
    const delayArray = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // ランダムな待ち時間を設定します (この場合、最大3秒)
      delayArray[i] = Math.random() * 3;
    }
    particlesGeometry.setAttribute(
      "delay",
      new THREE.Float32BufferAttribute(delayArray, 1)
    );

    function animate() {
      const elapsedTime = clock.getElapsedTime();
      // パーティクルの位置を更新
      particles.geometry.attributes.position.array.forEach((value, index) => {
        // 流れ星のパーティクルのみを移動させる
        if (
          particles.geometry.attributes.star.array[Math.floor(index / 3)] ===
          1.0
        ) {
          // 動き出すべき時刻が来た場合のみパーティクルを移動させる
          if (
            elapsedTime >
            particles.geometry.attributes.delay.array[Math.floor(index / 3)]
          ) {
            // z方向に移動させる
            if (index % 3 === 2) {
              particles.geometry.attributes.position.array[index] += .7; // ここで指定した数値が流れ星の速度

              // パーティクルが一定の距離を超えたら元の位置に戻し、新しい待ち時間を設定する
              if (particles.geometry.attributes.position.array[index] > 10) {
                // 以下の -= の値は、positionArray[i] = (Math.random() - 0.5) * 値;
                // の値と揃える必要がある。
                particles.geometry.attributes.position.array[index] -= 15;
                particles.geometry.attributes.delay.array[
                  Math.floor(index / 3)
                ] = elapsedTime + 1 + Math.random() * 3; // 次に動き出す時刻を設定
              }
            }
          }
        }
      });
      // パーティクルの位置が変更されたことを認識させる
      particles.geometry.attributes.position.needsUpdate = true;
      // カメラを回転させる
      camera.position.x = Math.cos(elapsedTime * speedFactor) * 2;
      camera.position.z = Math.sin(elapsedTime * speedFactor) * 2;
      camera.lookAt(scene.position);
      // ユーザーがマウス操作でカメラアングルを変更する場合以下の記述が必要
      // controls.update();

      //レンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    //ブラウザのリサイズに対応
    function onWindowResize() {
      sizes.width = parentElement.clientWidth;
      sizes.height = parentElement.clientHeight;
      renderer.setSize(sizes.width, sizes.height);
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
    }
    animate();
    const cancelAnimationFrameId = requestAnimationFrame(animate);

    const debouncedOnWindowResize = debounce(onWindowResize, 200);
    window.addEventListener("resize", debouncedOnWindowResize);
    return () => {
      cancelAnimationFrame(cancelAnimationFrameId);
      // window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("resize", debouncedOnWindowResize);
    };
  }, []);
  return <div ref={mountRef} className="worksBackground"></div>;
};

export default WorksBackground;
