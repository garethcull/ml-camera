$(document).ready(function(){
            
        
    // **** Connect SocketIO ******    

    // start up a SocketIO connection to the server 
    var socket = io.connect('http://' + document.domain + ':' + location.port);


    // Event handler for new connections.
    // The callback function is invoked when a connection with the server is established.
    socket.on('connect', function() {

        // Successful connection message
        socket.emit('connection_msg', {data: 'I\'m connected!'});
        console.log('connected')
        
    });   



    
    // **** Camera Image Settings ****
    
    
    const player = document.getElementById('player');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const captureButton = document.getElementById('capture');
    
    const constraints = {
    video: true, // to enable back camera - add --- > advanced: [{facingMode: "environment"}] https://stackoverflow.com/questions/18625007/enable-rear-camera-with-html5
    advanced: [{facingMode: "environment"}]    
    };
    
    // set a var for on clicks and then send that through with socket emit
    var mlType = 'label'
    
        $("#label-link").on( "click", function() {
        mlType = 'label';
        console.log(mlType);
});

    $("#text-extract-link").on( "click", function() {
        mlType = 'extract-text'; 
        console.log(mlType);
});

    
    function send_data(mlType,img){ 
        
        console.log([mlType,img]);
    
        socket.emit('send_img', {data:[mlType,img]});
    
    };
    
    captureButton.addEventListener('click', () => {
        
        var drawImage = context.drawImage(player, 0, 0, canvas.width, canvas.height);
        var imgData = context.getImageData(0, 0, canvas.width, canvas.width);
        //console.log(imgData);
        var img = canvas.toDataURL("image/png");
        // console.log(img);
        //$('#canvas2').html(imgData);        

        
        // *** SocketIO - send image to server side with event 'send_img' ***
        
        send_data(mlType,img);
        //socket.emit('send_img', {data: img});

        // Stop all video streams.
        player.srcObject.getVideoTracks().forEach(track => track.stop());
        
    });
    
    
    

    
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      
        // Attach the video stream to the video element and autoplay.
        player.srcObject = stream;
    
    });
    
    socket.on('my_response', function(msg) {

        // About this function:
        // After python has processed the current user's lat/lon and determined the top 5 stations closest to their position,
        // the python file location_test.py emits all station data back to the browser in a message called 'my_response'
        // This function then parses all of that data for display on the map and other key metrics. 


        // the following lines parse 'msg' back from 'my_response' and stores the closest station's attribute data into vars

        // store msg.data into a variable called arr    
        var arr = msg.data[0];
        console.log(arr);
        $('#data').html(arr); 
        
    });




});         // end of document ready function