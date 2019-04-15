paper.install(window)
window.onload = function() {
        // Get a reference to the canvas object
        var canvas = document.getElementById('myCanvas');
        // Create an empty project and a view for the canvas:

        paper.setup(canvas);
        // Create a Paper.js Path to draw a line into it:
        var event_height = 70;

    var sampleSpace = new Shape.Ellipse({
        center: [500, 200],
        radius: [200, 180],
        fillColor: '#dedede',
        strokeWidth: 5,
        strokeColor: '#cdcdcd'
    });



    var eventA = new Shape.Ellipse({
        center: [450, 200],
        radius: [80, event_height],
        fillColor: '#ff0000',
    });


    var eventB = new Shape.Ellipse({
        center: [550, 200],
        radius: [80, event_height],
        fillColor: '#0000ff',
    });

    var eventAmask = new Shape.Ellipse({
        center: [450, 200],
        radius: [80, event_height],
    });


    var eventBmask = new Shape.Ellipse({
        center: [550, 200],
        radius: [80, event_height],
    });

    var group = new Group(eventAmask, eventBmask);
    group.clipped = true;
    group.fillColor = '#bb00dd';

        // Draw the view now:
        paper.view.draw();
    }