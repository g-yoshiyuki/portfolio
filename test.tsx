function animate() {
      const elapsedTime = clock.getElapsedTime();

      let positionAttribute = particles.geometry.getAttribute('position');
      let starArray = Array.from(particles.geometry.getAttribute('star').array);
      let delayArray = Array.from(particles.geometry.getAttribute('delay').array);

      for (let index = 0; index < positionAttribute.count; index++) {
        // 流れ星のパーティクルのみを移動させる
        if (starArray[index] === 1.0) {
          // 動き出すべき時刻が来た場合のみパーティクルを移動させる
          if (elapsedTime > delayArray[index]) {
            // z方向に移動させる
            let zPosition = positionAttribute.getZ(index);
            zPosition += 1;
            // パーティクルが一定の距離を超えたら元の位置に戻し、新しい待ち時間を設定する
            if (zPosition > 10) {
              zPosition -= 20;
              // 次に動き出す時刻を設定
              delayArray[index] = elapsedTime + 1 + Math.random() * 4;
            }
            positionAttribute.setZ(index, zPosition);
          }
        }
      }

      // パーティクルの位置が変更されたことを認識させる
      positionAttribute.needsUpdate = true;
      particles.geometry.setAttribute('delay', new THREE.BufferAttribute(new Float32Array(delayArray), 1));
      // カメラを回転させる
      camera.position.x = Math.cos(elapsedTime * speedFactor) * 2;
      camera.position.z = Math.sin(elapsedTime * speedFactor) * 2;
      camera.lookAt(scene.position);
      controls.update();
      //レンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      animationFrameId = requestAnimationFrame(animate);
    }

    /* ----------------------- */
/*軽量化コード
/* ----------------------- */
function animate() {
  const elapsedTime = clock.getElapsedTime();

  let positionAttribute = particles.geometry.getAttribute('position');
  let starArray = particles.geometry.getAttribute('star').array as Float32Array;
  let delayArray = particles.geometry.getAttribute('delay').array as Float32Array;

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
