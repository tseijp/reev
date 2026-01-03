import * as THREE from 'three'

export class Mat extends THREE.MeshPhysicalMaterial {
        uniforms: {}

        constructor(parameters: any = {}) {
                parameters.transparent = true
                parameters.opacity = 0.85
                super(parameters)
                this.onBeforeCompile = this.onBeforeCompile.bind(this)
        }

        onBeforeCompile(shader: any) {
                shader.uniforms = {
                        ...shader.uniforms,
                        ...this.uniforms,
                }
        }
}
