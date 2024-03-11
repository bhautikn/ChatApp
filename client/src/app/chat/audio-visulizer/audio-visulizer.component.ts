import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-audio-visulizer',
  templateUrl: './audio-visulizer.component.html',
  styleUrl: './audio-visulizer.component.css'
})
export class AudioVisulizerComponent {
  audio:any;
  @Input() localstream: any;
  
  ngAfterViewInit() {
      const mediaDevices = navigator.mediaDevices;
      this.audio = document.querySelector('#myAudio');

      // mediaDevices.getUserMedia({
      //   audio: true,
      // }).then((stream) => {
        // this.localstream = stream
        this.audio.srcObject = this.localstream;
        // this.audio.load();
        this.audio.play();
        var context = new AudioContext();
        var src = context.createMediaElementSource(this.audio);
        console.log(src);
        var analyser = context.createAnalyser();  
  
        var canvas: any = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");
  
        src.connect(analyser);
        analyser.connect(context.destination);
  
        analyser.fftSize = 256;
  
        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
  
        var dataArray = new Uint8Array(bufferLength);
  
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
  
        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
  
        function renderFrame() {
          requestAnimationFrame(renderFrame);
  
          x = 0;
  
          analyser.getByteFrequencyData(dataArray);
  
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
          for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
  
            var r = barHeight + (25 * (i / bufferLength));
            var g = 250 * (i / bufferLength);
            var b = 50;
  
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
  
            x += barWidth + 1;
          }
        }
  
        // this.audio.play();
        renderFrame();
        this.audio.muted = true;
      // });
    // };
  }
}
