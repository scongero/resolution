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

    var ruleSet = { 'S': ['a','+','-','*','/'],
                    '+': [['S','S']],
                    '-': [['S','S']],
                    '*': [['S','S']],
                    '/': [['S','S']]    };

    var varSet = ['S'];

    var literalAlphabet = ['a','b','c','d'];
    var operationAlphabet = ['+','-','*','/'];

    var maxNum = 20;

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
        this.num = null;
        this.children = [];
    }

    function Tree(data) {
        var node = new Node(data);
        node.id = 0;
        this._root = node;
        this.numNodes = 1;
        this.leaves = [this._root];
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

        return child;
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
            statement += node.num;
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

    function computeValOf(node) {
        if (literalAlphabet.includes(node.data)) {
            node.num = Math.floor(Math.random()*maxNum+1);
            return node.num;
        }
        var currVal;
        for (var child of node.children) {
            if (child === node.children[0]) {
                currVal = computeValOf(child);
                continue;
            }
            if (node.data === '+') {
                currVal += computeValOf(child);
            } else if (node.data === '-') {
                currVal -= computeValOf(child);
            } else if (node.data === '*') {
                currVal *= computeValOf(child);
            } else if (node.data === '/') {
                currVal /= computeValOf(child);
            }
        }
        node.num = currVal;
        console.log(node.num);
        return node.num;
    }

    Tree.prototype.compute = function() {
        return computeValOf(this._root);
    }


    var problemTree = new Tree('S');
    console.log(problemTree.leaves);

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }

    function arrayRemove(arr, value) {
        for (var i=0;i<arr.length;i++) {
            if (arr[i]===value) {
                arr.splice(i,1);
                i--;
            }
        }
    }

    // generate random tree

    var opCount = 0;

    while(opCount<20) {
        if (problemTree.leaves.length===0) {
            break;
        }
        var leaf = getRandomItem(problemTree.leaves);

        var ruleOuput = getRandomItem(ruleSet[leaf.data]);

        console.log('ruleOuput');
        console.log(ruleOuput);
        for (const val of ruleOuput) {
            var newChild = problemTree.add(val,leaf.id,problemTree.traverseBF);
            console.log('newChild:');
            console.log(newChild);
            if (!literalAlphabet.includes(newChild.data)) {
                problemTree.leaves.push(newChild);
            }
        }
        console.log(leaf.children.length);
        console.log(problemTree.leaves);
        
        arrayRemove(problemTree.leaves, leaf);
        console.log('leaves:');
        console.log(problemTree.leaves.length);

        opCount++;
    }

    function printLeaves(array) {
        for (const leaf of array) {
            console.log(leaf.data);
        }
    }

    // cleanup all leaves by going straight to literals
    printLeaves(problemTree.leaves);
    console.log('cleanup:');

    while (problemTree.leaves.length!=0) {
        console.log(problemTree.leaves.length);
        var leaf = problemTree.leaves[0];
        console.log(leaf);
        if (ruleSet[leaf.data].includes('a')) {
            console.log('hello');
            problemTree.add('a',leaf.id,problemTree.traverseBF);
        } else {
            console.log(ruleSet[leaf.data][0]);
            for (const val of ruleSet[leaf.data][0]){
                var newChild = problemTree.add(val,leaf.id,problemTree.traverseBF);
                if (!literalAlphabet.includes(newChild.data)) {
                    problemTree.leaves.push(newChild);
                }
            }
        }
        printLeaves(problemTree.leaves);
        problemTree.leaves.shift();
        console.log('post shift');
        printLeaves(problemTree.leaves);
    }
    

    var ans = problemTree.compute();

    var statement = problemTree.speak();
    problem.content += statement;

    
    problem.content = problem.content + '  = ' + ans;

    // Draw the view now:
    paper.view.draw();

}
