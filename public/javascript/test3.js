paper.install(window)
var A1,B1,C1,aINTb,aINTc,bINTc,three;
var tool1;
var tool3;
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

    tool1 = new Tool();
    var tool2 = new Tool();

    var eventACenterX = SSCenterX-40;
    var eventACenterY = SSCenterY-40;

    var A1color = '#ff0000';
    A1 = new Path.Circle({
        center: [eventACenterX, eventACenterY],
        radius: 80,
        fillColor: A1color,
    });

    var eventBCenterX = SSCenterX+40;
    var eventBCenterY = SSCenterY-40;

    var B1color = '#0000ff';
    B1 = new Path.Circle({
        center: [eventBCenterX, eventBCenterY],
        radius: 80,
        fillColor: B1color,
    });

    

    var eventCCenterX = SSCenterX;
    var eventCCenterY = SSCenterY+40;

    var C1color = '#00ff00';
    C1 = new Path.Circle({
        center: [eventCCenterX, eventCCenterY],
        radius: 80,
        fillColor: C1color,
    });
   
    var aINTbcolor = '#bb00dd';
    aINTb = A1.intersect(B1);
    aINTb.fillColor = aINTbcolor;

    var aINTccolor = '#bb9900';
    aINTc = A1.intersect(C1);
    aINTc.fillColor = aINTccolor;

    var bINTccolor = '#00bbbb';
    bINTc = B1.intersect(C1);
    bINTc.fillColor = bINTccolor;

    var threecolor = '#575757';
    three = A1.intersect(bINTc);
    three.fillColor = threecolor;
    three.insertAbove(aINTc);


    sampleSpace.sendToBack();

    

    
    
    var aINTbtoggle = 0;
    aINTb.onClick = function(event) {
        if (aINTbtoggle) {
            this.fillColor = aINTbcolor;
            aINTbtoggle = 0;
        } else {
            this.fillColor = '#ffff00';
            aINTbtoggle = 1;
        }
        
    }
    var aINTctoggle = 0;
    aINTc.onClick = function(event) {
        if (aINTctoggle) {
            this.fillColor = aINTccolor;
            aINTctoggle = 0;
        } else {
            this.fillColor = '#ffff00';
            aINTctoggle = 1;
        }
        
    }
    var bINTctoggle = 0;
    bINTc.onClick = function(event) {
        if (bINTctoggle) {
            this.fillColor = bINTccolor;
            bINTctoggle = 0;
        } else {
            this.fillColor = '#ffff00';
            bINTctoggle = 1;
        }
        
    }
    var threetoggle = 0;
    three.onClick = function(event) {
        if (threetoggle) {
            this.fillColor = threecolor;
            threetoggle = 0;
        } else {
            this.fillColor = '#ffff00';
            threetoggle = 1;
        }
        
    }

    var C1toggle = 0;
    C1.onClick = function(event) {
        if (C1toggle) {
            this.fillColor = C1color;
            C1toggle = 0;
        } else {
            this.fillColor = '#ffff00';
            C1toggle = 1;
        }
        
    }

    var A1toggle = 0;
    A1.onClick = function(event) {
        if (A1toggle) {
            this.fillColor = '#ff0000';
            A1toggle = 0;
        } else {
            this.fillColor = '#ffff00';
            A1toggle = 1;
        }
        
    }

    var B1toggle = 0;
    B1.onClick = function(event) {
        if (B1toggle) {
            this.fillColor = B1color;
            B1toggle = 0;
        } else {
            this.fillColor = '#ffff00';
            B1toggle = 1;
        }
        
    }

    
    sampleSpace.sendToBack();

    tool1.onMouseMove = function(event) {

        if (Key.isDown('a')) {

            A1.visible = false;
            A1.position = event.point;

            aINTb.copyContent(A1.intersect(B1));

            aINTc.copyContent(A1.intersect(C1));

            three.copyContent(A1.intersect(bINTc));

            A1.visible = true;
        }

        if (Key.isDown('d')) {

            B1.visible = false;
            B1.position = event.point;

            aINTb.copyContent(B1.intersect(A1));

            bINTc.copyContent(B1.intersect(C1));

            three.copyContent(B1.intersect(aINTc));

            B1.visible = true;
        }

        if (Key.isDown('s')) {

            C1.visible = false;
            C1.position = event.point;

            aINTc.copyContent(C1.intersect(A1));

            bINTc.copyContent(C1.intersect(B1));

            three.copyContent(C1.intersect(aINTb));

            C1.visible = true;
        }
   
    }




    // Draw the view now:
    paper.view.draw();

}
