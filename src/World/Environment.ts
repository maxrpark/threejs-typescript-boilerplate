import * as THREE from "three";
import { Experience } from "../experience/Experience";
import { Debug } from "../experience/utils";
import GUI from "lil-gui";
interface IProps {
  environmentMapTexture?: any;
}
interface EnvironmentInt {
  experience: Experience;
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  scene: THREE.Scene;
  environmentMapTexture: any;
  environmentMap: any;
  debug: Debug;
  debugFolder: GUI;

  setAmbientLight: () => void;
  setDirectionalLight: () => void;
  setEnvironmentMap: () => void;
}

export class Environment implements EnvironmentInt {
  experience: Experience;
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  scene: THREE.Scene;
  environmentMapTexture: any;
  environmentMap: any;
  debug: Debug;
  debugFolder: GUI;

  constructor(props?: IProps) {
    Object.assign(this, props);
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setDirectionalLight();
    // this.setAmbientLight();

    if (this.environmentMapTexture) {
      this.setEnvironmentMap();
    }
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
    this.scene.add(this.ambientLight);
  }

  setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight("#00ffff", 4);

    this.directionalLight.position.set(0.25, 3, -2.25);

    this.directionalLight.shadow.mapSize.width = 512;
    this.directionalLight.shadow.mapSize.height = 512;

    this.directionalLight.shadow.camera.near = 2;
    this.directionalLight.shadow.camera.far = -2;

    this.directionalLight.shadow.camera.top = 2;
    this.directionalLight.shadow.camera.bottom = -2;
    this.directionalLight.shadow.camera.right = 2;
    this.directionalLight.shadow.camera.left = -2;

    const directionalLightCameraHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );
    this.scene.add(this.directionalLight);
    this.scene.add(directionalLightCameraHelper);
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 1;
    this.environmentMap.texture = this.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.background = this.environmentMap.texture;
    this.scene.environment = this.environmentMap.texture;

    this.experience.renderer.renderer.outputEncoding = THREE.sRGBEncoding;
    this.experience.renderer.renderer.toneMapping = THREE.LinearToneMapping;
    this.experience.renderer.renderer.toneMappingExposure = 1;

    this.environmentMap.updateMaterial = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterial();

    // Debug

    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterial);
    }
  }
}
