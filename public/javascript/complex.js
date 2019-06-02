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

    var startString = 'here is your problem: ';

    var ruleSet = { 'S': ['a','+','-','*','/'],
                    '+': [['S','S']],
                    '-': [['S','S']],
                    '*': [['S','S']],
                    '/': [['S','S']]    };

    var varSet = ['S'];

    var literalAlphabet = ['a','b','c','d'];
    var operationAlphabet = ['+','-','*','/'];

    var maxNum = 10;

    var CFG = {
        variables: varSet,
        rules: ruleSet,
        startState: 'S'
    };

    // testing mathjax

    var jax = document.getElementById('testJax');
    var magVal = document.getElementById('magnitude');
    

    // tree

    
    function Node(data) {
        this.data = data;
        this.id = -1;
        this.parent = null;
        this.numA = null;
        this.numB = null;
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

    function printNodeNum(node) {
        if (node.numB === 0) {
            return node.numA;
        } else {
            return '(' + node.numA + ' + ' + node.numB + 'j)';
        }
    }

    function printNum(num) {
        if (num[1] === 0) {
            return num[0].toFixed(2);
        } else {
            return '(' + num[0].toFixed(2) + ' + ' + num[1].toFixed(2) + 'j)';
        }
    }

    function printStatementOf(node,statement) {

        if (literalAlphabet.includes(node.data)) {
            statement += printNodeNum(node);
            return statement;
        } else if (varSet.includes(node.data)) {
            return printStatementOf(node.children[0],statement);
        } else if (operationAlphabet.includes(node.data)) {
            statement += '(';
            if (node.data === '/') {
                statement += '\\frac{';
            }
            for (const child of node.children) {
                statement = printStatementOf(child,statement);
                if (child != node.children[node.children.length-1]) {
                    if (node.data === '*') {
                        statement += '\\cdot';
                    } else if (node.data === '/') {
                        statement += '}{';
                    } else {
                        statement += node.data;
                    }
                }
            }
            if (node.data === '/') {
                statement += '}';
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

    Tree.prototype.assignValuesToLiterals = function() {
        this.traverseBF(function(node) {
            if (literalAlphabet.includes(node.data)) {
                node.numA = Math.floor(Math.random()*maxNum+1);
                node.numB = Math.floor(Math.random()*maxNum);
            }
        });
    }

    function complexAdd(val1, val2) {
        var ans = [val1[0]+val2[0],val1[1]+val2[1]];

        return ans;
    }
    function complexSub(val1, val2) {
        return [val1[0]-val2[0],val1[1]-val2[1]];
    }
    function complexMult(val1, val2) {
        return [val1[0]*val2[0]-val1[1]*val2[1],val1[0]*val2[1]+val1[1]*val2[0]];
    }
    function complexDiv(val1, val2) {
        var realDenom = complexMult(val2, [val2[0],-val2[1]]);
        var complexNumer = complexMult(val1, [val2[0],-val2[1]]);
        return [complexNumer[0]/realDenom[0], complexNumer[1]/realDenom[0]];
    }

    function computeValOf(node) {
        if (literalAlphabet.includes(node.data)) {
           
            return [node.numA, node.numB];
        }
        var currVal;
        for (var child of node.children) {
            if (child === node.children[0]) {
                currVal = computeValOf(child);
                continue;
            }
            if (node.data === '+') {
                currVal = complexAdd(currVal, computeValOf(child));
            } else if (node.data === '-') {
                currVal = complexSub(currVal, computeValOf(child));
            } else if (node.data === '*') {
                currVal = complexMult(currVal, computeValOf(child));
            } else if (node.data === '/') {
                currVal = complexDiv(currVal, computeValOf(child));
            }
        }
        node.numA = currVal[0];
        node.numB = currVal[1];


        return [node.numA,node.numB];
    }

    Tree.prototype.compute = function() {
        return computeValOf(this._root);
    }

    function complexMag(c) {
        var ans = Math.sqrt(Math.pow(c[0],2)+Math.pow(c[1],2));
        /*
         var para = document.createElement("P");               // Create a <p> element
para.innerText = '$\\sqrt{' + c[0] + '^2 + ' + c[1] + '^2} = ' + ans + '$';               // Insert text
document.getElementById('testJax').appendChild(para);
*/
        return [ans,0];
    }

    function complexArg(c) {
        return [Math.atan2(c[1],c[0]),0]
    }

    function findMagOf(node) {
        // node.children.length = 0
        if (literalAlphabet.includes(node.data)) {
            return complexMag([node.numA,node.numB]);
        }

        // node.children.length > 0
        var currVal;
        if (varSet.includes(node.data)) {
            currVal = findMagOf(node.children[0]);
        } else if (node.data === '+') {
            currVal = computeValOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexAdd(currVal,computeValOf(node.children[i]));
            }
            currVal = complexMag(currVal);
        } else if (node.data === '-') {
            currVal = computeValOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexSub(currVal,computeValOf(node.children[i]));
            }
            currVal = complexMag(currVal);
        } else if (node.data === '*') {
            currVal = findMagOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexMult(currVal,findMagOf(node.children[i]));
            }
        } else if (node.data === '/') {
            currVal = findMagOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexDiv(currVal,findMagOf(node.children[i]));
            }
        }
        
        node.numA = currVal[0];
        node.numB = currVal[1];

        return [node.numA,node.numB];
    }

    function findArgOf(node) {
        // node.children.length = 0
        if (literalAlphabet.includes(node.data)) {
            return complexArg([node.numA,node.numB]);
        }

        // node.children.length > 0
        var currVal;
        if (varSet.includes(node.data)) {
            currVal = findArgOf(node.children[0]);
        } else if (node.data === '+') {

            currVal = computeValOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexAdd(currVal,computeValOf(node.children[i]));
            }
            currVal = complexArg(currVal);

        } else if (node.data === '-') {

            currVal = computeValOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexSub(currVal,computeValOf(node.children[i]));
            }
            currVal = complexArg(currVal);

        } else if (node.data === '*') {

            currVal = findArgOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexAdd(currVal,findArgOf(node.children[i]));
            }

        } else if (node.data === '/') {

            currVal = findArgOf(node.children[0]);
            for (var i=1;i<node.children.length;i++) {
                currVal = complexSub(currVal,findArgOf(node.children[i]));
            }

        }
        
        node.numA = currVal[0];
        node.numB = currVal[1];

        return [node.numA,node.numB];
    }


    Tree.prototype.findMag = function() {
        return findMagOf(this._root);
    }

    Tree.prototype.findArg = function() {
        return findArgOf(this._root);
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

    

    while(opCount<4) {
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

    problemTree.assignValuesToLiterals();
    

    var ans = problemTree.compute();

    var statement = problemTree.speak();
    problem.content += statement;

    
    problem.content = problem.content + '  = ' + ans[0].toFixed(2) + ' + ' + ans[1].toFixed(2) + 'j';

    problem.content = '';

    statement = statement.substr(1).slice(0,-1);

    jax.innerHTML = startString + '$' + statement + '  = ' + ans[0].toFixed(2) + ' + ' + ans[1].toFixed(2) + 'j' + '$';
    // Draw the view now:


    var mag = problemTree.findMag();
    magnitude.innerHTML = 'magnitude: ' + '$' + printNum(mag) + '$' + '   =?   ' + '$' + printNum(complexMag(ans)) + '$';

    var arg = problemTree.findArg();
    argument.innerHTML = 'argument: ' + '$' + printNum(arg) + '$' + '   =?   ' + '$' + printNum(complexArg(ans)) + '$';


     MathJax.Hub.Queue(
    function () {
    jax.style.visibility = "";
    magnitude.style.visibility = "";
    argument.style.visibility = "";
    });
    paper.view.draw();

    
}
