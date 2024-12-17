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
      // Get Controller Input
      let leftController = document.querySelector('[left-controller]').components['oculus-quest-controls'];
      let rightController = document.querySelector('[right-controller]').components['oculus-quest-controls'];
  
      if (leftController && rightController) {
        let leftJoystick = leftController.thumbstick;
        let aButton = rightController.getButton('aButton');
        let bButton = rightController.getButton('bButton');
  
        // Handle Acceleration/Braking
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

        // Handle Turning
        if (leftJoystick && this.data.speed > 0) {
            let turnAmount = leftJoystick.x * this.data.turnSpeed
            this.el.object3D.rotation.y -= turnAmount;
          }

           // Apply Movement
            const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.el.object3D.quaternion);
           const movement = direction.multiplyScalar(this.data.speed * 0.02); 
           this.el.object3D.position.add(movement)
       }

     }
  });