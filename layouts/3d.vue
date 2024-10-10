<template>
  <canvas id="three"></canvas>
</template>

<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function initThree() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#eee");

  const threeDemo = document.getElementById("three");
  const renderer = new THREE.WebGLRenderer({
    canvas: threeDemo,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  function resizeDevicePixel(renderer) {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  const controls = new OrbitControls(camera, renderer.domElement);

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    if (resizeDevicePixel(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
  }

  animate();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      console.log("Intersected Object:", intersectedObject.name);

      // 移除模型
      scene.remove(intersectedObject);
      if (intersectedObject.parent) {
        intersectedObject.parent.remove(intersectedObject);
      }
      // 添加图片
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load("/images/2.png", (texture) => {
        const geometry = new THREE.PlaneGeometry(5, 5);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 0, 0);
        scene.add(plane);
      });
    }
  }

  window.addEventListener("click", onMouseClick, false);

  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/models/person.glb", (gltf) => {
    const model = gltf.scene;

    // 打印模型层次结构以调试
    console.log("Model Hierarchy:", model);

    // 遍历模型层次结构并打印每个对象的名称
    model.traverse((child) => {
      console.log(child.name);
    });

    // 将模型向下移动
    model.position.y = -2;

    // 添加环境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 添加前方的方向光源
    const frontLight = new THREE.DirectionalLight(0xffffff, 3.5);
    frontLight.position.set(400, 200, 300);
    scene.add(frontLight);

    // 添加背部的方向光源
    const backLight = new THREE.DirectionalLight(0xffffff, 2.5);
    backLight.position.set(-400, -200, -300);
    scene.add(backLight);

    scene.add(model);
  });
}

onMounted(() => {
  initThree();
});
</script>

<style lang="less" scoped>
#three {
  margin-top: 25px;
  width: 225px;
  height: 300px;
}
</style>
