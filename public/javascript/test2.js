paper.install(window)

window.onload = function() {
        // Get a reference to the canvas object
        var canvas = document.getElementById('myCanvas');
        // Create an empty project and a view for the canvas:

        paper.setup(canvas);
        // Create a Paper.js Path to draw a line into it:
        var event_height = 70;

    var SSCenterX = 500;
    var SSCenterY = 300;

    var sampleSpace = new Path.Circle({
        center: [SSCenterX, SSCenterY],
        radius: 200,
        fillColor: '#dedede',
        strokeWidth: 5,
        strokeColor: '#cdcdcd'
    });

    var tool = new Tool();

    var eventACenterX = SSCenterX-40;
    var eventACenterY = SSCenterY-40;

    var A1 = new Path.Circle({
        center: [eventACenterX, eventACenterY],
        radius: 80,
        fillColor: '#ff0000',
    });

    var eventBCenterX = SSCenterX+40;
    var eventBCenterY = SSCenterY-40;


    var B1 = new Path.Circle({
        center: [eventBCenterX, eventBCenterY],
        radius: 80,
        fillColor: '#0000ff',
    });

    var eventCCenterX = SSCenterX;
    var eventCCenterY = SSCenterY+40;

    var C1 = new Path.Circle({
        center: [eventCCenterX, eventCCenterY],
        radius: 80,
        fillColor: '#00ff00',
    });

    var aINTb = A1.intersect(B1);
    aINTb.fillColor = '#bb00dd';

    var three = A1.intersect(B1).intersect(C1);
    three.fillColor = '#575757';

    

    var aINTc = A1.intersect(C1);
    aINTc.fillColor = '#bb9900';

    var bINTc = B1.intersect(C1);
    bINTc.fillColor = '#00bbbb';


    A1.sendToBack();
    B1.sendToBack();
    C1.sendToBack();
    sampleSpace.sendToBack();


    tool.onMouseDown = function(event) {

    aINTb.remove();
    A1.remove();
    A1 = new Path.Circle({
        center: event.point,
        radius: 80,
        fillColor: '#ff0000',
    });
    A1.position = event.point;


    aINTb = A1.intersect(B1);
    aINTb.fillColor = '#bb00dd';

    

    
    aINTc = A1.intersect(C1);
    aINTc.fillColor = '#bb9900';

    bINTc = B1.intersect(C1);
    bINTc.fillColor = '#00bbbb';

    three = A1.intersect(B1).intersect(C1);
    three.fillColor = '#575757';

    A1.sendToBack();
    B1.sendToBack();
    C1.sendToBack();
    sampleSpace.sendToBack();

        
    }


    // Draw the view now:
    paper.view.draw();

}
