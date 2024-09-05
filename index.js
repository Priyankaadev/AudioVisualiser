document.getElementById( 'audio')
   .addEventListener('change', ( event)=>{
    
    const file = event.target.files[0]
    
    const reader = new FileReader();

    reader.addEventListener('load', (event)=>{
       const arrayBuffer = event.target.result
        
       const audioContext = new (window.AudioContext || window.webkitAudioContext)();

       audioContext.decodeAudioData(arrayBuffer, (audioBuffer)=>{
         // console.log(audioBuffer);
         visualize(audioBuffer) 
       })
    })

    reader.readAsArrayBuffer(file)   
    
} )

function visualize(audioBuffer) {
   const canvas = document.getElementById('canvas');
   canvas.width = 800;
   canvas.height = 200;



   const canvasContext = canvas.getContext('2d') 

   const channelData = audioBuffer.getChannelData(0) 
   // console.log(channelData);

   const numberOfChunks = 400;
   const chunkSize = Math.ceil(channelData.length / numberOfChunks);

   canvasContext.fillStyle = '#2633ed'
   // console.log(canvas.width, canvas.height);

   const center = canvas.height/2;
   const barWidth = canvas.width / numberOfChunks
   

   for (let i = 0; i < numberOfChunks; i++) {
      const chunk = channelData.slice(i * chunkSize, (i + 1)*chunkSize ) 
      
      const min = Math.min(...chunk)
      const max = Math.max(...chunk) 
      // console.log(min, max);
       
      canvasContext.fillRect(
         i*barWidth,
         center-max,
         barWidth,
         max + Math.abs(min)
      )
   }

   
}