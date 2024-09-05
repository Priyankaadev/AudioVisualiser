document.getElementById( 'audio')
   .addEventListener('change', ( event)=>{
    
    const file = event.target.files[0]
    
    const reader = new FileReader();

    reader.addEventListener('load', (event)=>{
       const arrayBuffer = event.target.result
        
       const audioContext = new (window.AudioContext || window.webkitAudioContext)();

       audioContext.decodeAudioData(arrayBuffer, (audioBuffer)=>{
         // console.log(audioBuffer);
         visualize(audioBuffer, audioContext) 
       })
    })

    reader.readAsArrayBuffer(file)   
    
} )

function visualize(audioBuffer, audioContext) { 
   const canvas = document.getElementById('canvas');
   canvas.width = 800;
   canvas.height = 200;

   const analyser = audioContext.createAnalyser()
   analyser.fftSize = 256

   const frequencyBufferLength = analyser.frequencyBinCount
   // console.log(analyser.frequencyBinCount);
   const frequencyData = new Uint8Array(frequencyBufferLength)
   
   const source = audioContext.createBufferSource();
   source.buffer = audioBuffer
   source.connect(analyser)
   analyser.connect(audioContext.destination)
   source.start()

   const canvasContext = canvas.getContext('2d') 
      
   canvasContext.fillStyle = '#2633ed'
   // console.log(canvas.width, canvas.height);

   const barWidth = canvas.width / frequencyBufferLength

   setInterval(() => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      
      analyser.getByteFrequencyData(frequencyData)
   //   console.log(frequencyData);
   
      for (let i = 0; i < frequencyBufferLength; i++) {
               
         canvasContext.fillRect(
            i*barWidth,
            canvas.height - frequencyData[i],
            barWidth,
            frequencyData[i]
         )
      }
   }, 100);

  

   
}