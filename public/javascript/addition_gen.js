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

    var problem = new PointText({
        point:[50,50],
        content: 'Here is your problem: ',
        fillColor: 'black',
        fontFamily: 'Courier New',
        fontWeight: 'bold',
        fontSize: 25
    });

    var ruleSet = {'S': [['a'],['+','S','S']]};

    var varSet = ['S'];

    var literalAlphabet = ['a','b','c','d'];
    var operationAlphabet = ['+','-','*','/'];

    var CFG = {
        variables: varSet,
        rules: ruleSet,
        startState: 'S'
    };

    // tree

    
    function Node(data) {
        this.data = data;
        this.id = -1;
        this.parent = null;
        this.children = [];
    }

    function Tree(data) {
        var node = new Node(data);
        node.id = 0;
        this._root = node;
        this.numNodes = 1;
    }

    Tree.prototype.traverseDF = function(callback) {

        (function recurse(currentNode) {
            for (var i=0, length = currentNode.children.length; i<length; i++) {
                recurse(currentNode.children[i]);
            }
            callback(currentNode);
        })(this._root);
    };

    Tree.prototype.traverseBF = function(callback) {

        var queue = new Queue();

        queue.enqueue(this._root);

        currentTree = queue.dequeue();

        while(currentTree) {
            for (var i=0, length = currentTree.children.length; i<length; i++) {
                queue.enqueue(currentTree.children[i]);
            }

            callback(currentTree);
            currentTree = queue.dequeue();
        }
    };

    Tree.prototype.contains = function(callback, traversal) {
        traversal.call(this, callback);
    };

    Tree.prototype.add = function(data, toID, traversal) {
        var child = new Node(data),
            parent = null,
            callback = function(node) {
                if (node.id === toID) {
                    parent = node;
                }
            };

        this.contains(callback, traversal);

        if (parent) {
            child.id = this.numNodes;
            parent.children.push(child);
            child.parent = parent;
            this.numNodes++;
        } else {
            throw new Error('Cannot add node to a non-existent parent.');
        }
        return child.id;
    };

    function findIndex(arr, data) {
        var index;

        for (var i=0; i < arr.length; i++) {
            if (arr[i].data === data) {
                index = i;
            }
        }

        return index;
    }

    Tree.prototype.remove = function(data, fromData, traversal) {
        var tree = this,
            parent = null,
            childeToRemove = null,
            index;

        var callback = function(node) {
            if (node.data === fromData) {
                parent = node;
            }
        };

        this.contains(callback, traversal);

        if (parent) {
            index = findIndex(parent.children, data);

            if (index === undefined) {
                throw new Error('Node to remove does not exist.');
            } else {
                childeToRemove = parent.children.splice(index, 1);
            }
        } else {
            throw new Error('Parent does not exist.');
        }

        return childeToRemove;
    };

    function printStatementOf(node,statement) {

        if (literalAlphabet.includes(node.data)) {
            statement += node.data;
            return statement;
        } else if (varSet.includes(node.data)) {
            return printStatementOf(node.children[0],statement);
        } else if (operationAlphabet.includes(node.data)) {
            statement += '(';
            for (const child of node.children) {
                statement = printStatementOf(child,statement);
                if (child != node.children[node.children.length-1]) {
                    statement += node.data;
                }
            }
            statement += ')';
            return statement;
        }
    }

    Tree.prototype.speak = function() {
        var statement = '';

        statement = printStatementOf(this._root, statement);

        console.log(statement);

        return statement;
    };


    var problemTree = new Tree('S');

    var outputString = '';
    var outputArray = ruleSet['S'];
    var randomRuleIndex = Math.floor(Math.random()*outputArray.length);
    console.log(randomRuleIndex);
    if (outputArray[randomRuleIndex][0]==='a') {
        var num = Math.floor(Math.random()*9+1);
        console.log('got an a ' + num);
        outputString += 'a';
        problemTree.add('a',0,problemTree.traverseBF);
    } else {
        var operation = outputArray[randomRuleIndex][0];
        var opNodeID = problemTree.add('+',0,problemTree.traverseBF);
        var id1 = problemTree.add('S',opNodeID,problemTree.traverseBF);
        console.log('numNodes: ' + problemTree.numNodes);
        var id2 = problemTree.add('S',opNodeID,problemTree.traverseBF);
        console.log('numNodes: ' + problemTree.numNodes);

        var opNodeID2 = problemTree.add('-',id1,problemTree.traverseBF);

        problemTree.add('a',opNodeID2,problemTree.traverseBF);
        console.log('numNodes: ' + problemTree.numNodes);
        problemTree.add('b',opNodeID2,problemTree.traverseBF);
        console.log('numNodes: ' + problemTree.numNodes);

        problemTree.add('c',id2,problemTree.traverseBF);
        console.log('numNodes: ' + problemTree.numNodes);
    }

    console.log(outputString);

    console.log('start:');
    problemTree.traverseBF(function(node) {
        console.log(node.data + ' ' + node.id);
    });

    var statement = problemTree.speak();
    problem.content += statement;


    // Draw the view now:
    paper.view.draw();

}
