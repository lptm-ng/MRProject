AFRAME.registerComponent('car-controller', {
  schema: {
    speed: { type: 'number', default: 0 },
    maxSpeed: { type: 'number', default: 5 },
    acceleration: { type: 'number', default: 0.1 },
    brakingForce: { type: 'number', default: 0.2 },
    turnSpeed: { type: 'number', default: 3 },
    stopThreshold: {type:'number', default: 0.01},
    deceleration: {type:'number', default: 0.05}
  },

  init: function () {
    this.moving = false;
    this.braking = false;
  },
  tick: function () {
    // controller input
    let leftController = document.querySelector('[left-controller]');
    let rightController = document.querySelector('[right-controller]');


    if (leftController && rightController && leftController.components['oculus-quest-controls'] && rightController.components['oculus-quest-controls']) {
      let leftJoystick = leftController.components['oculus-quest-controls'].thumbstick;
      let aButton = rightController.components['oculus-quest-controls'].getButton('aButton');
      let bButton = rightController.components['oculus-quest-controls'].getButton('bButton');

      // acceleration/braking
      if (bButton) {
          this.braking = true;
          this.moving = false;
          this.data.speed -= this.data.brakingForce
          if(this.data.speed < 0){
              this.data.speed = 0
          }
        
      } else if (aButton) {
        this.moving = true;
          this.braking = false;
          this.data.speed += this.data.acceleration;
        
        if (this.data.speed > this.data.maxSpeed) {
          this.data.speed = this.data.maxSpeed;
        }
      }else{
          this.braking = false;
          if (this.data.speed > 0 && !this.moving){
            this.data.speed -= this.data.deceleration
          }
          if(this.data.speed < this.data.stopThreshold){
              this.data.speed = 0
          }
      }

      // turning
      if (leftJoystick && this.data.speed > 0) {
          let turnAmount = leftJoystick.x * this.data.turnSpeed
          this.el.object3D.rotation.y -= turnAmount;
        }

        // movement
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.el.object3D.quaternion);
        const movement = direction.multiplyScalar(this.data.speed * 0.02); 
        this.el.object3D.position.add(movement)
    }

  }
});