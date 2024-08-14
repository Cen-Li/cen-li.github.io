var canvas, gl;
var textcanvas, ctx;
var arrayString;
var arrayNumbers = [];
var textPos = [];
var vertices; // all the vertices for drawing rectangles
var vertices_origin;
var colors; // all the colors for drawing rectangles
var colors_origin;
var vBuffer;
var vPosition;
var cBuffer;
var vColor;
var gradient, gradient0;
var linePtr;

var canvasWidth;
var canvasHeight;

var algorthm_index = 0; // 1: sort 2: search 3: insert

var FIRST_READ_FLAG = 1;
var selection_sort_code_lines;
var linear_search_code_lines;
var binar_search_code_lines;
var insert_code_lines;
var delete_by_location_code_lines;
var delete_by_value_code_lines;

var color_red = vec4(1.0, 0.0, 0.0, 1.0);
var color_green = vec4(0.0, 1.0, 0.0, 1.0);
var color_blue = vec4(0.0, 0.0, 1.0, 1.0);
var color_yellow = vec4(1.0, 1.0, 0.0, 1.0);

var current_step = 0;
// totals
var total_vertices;
var total_colors;
var total_arrayNumbers;
var total_steps;
var total_textPos;
var total_linePtr;
var total_isMoving;
var total_no_ticks; //just for insert 
// global flags
var isPlaying = 0;
var isMoving = 0;
var isSorted = 0;
var isBinarySearched = 0;
var isShown = 0;
// global constants
var delay;
var delay_base = 200;
var move_steps = 10;
//
var no_tick_index;
var returned_value_by_delete;
var returned_index_by_delete;

window.onload = function main() {

    textcanvas = document.getElementById("text-canvas");
    ctx = textcanvas.getContext('2d');
    //ctx.font = '24px serif';

    canvas = document.getElementById("gl-canvas");

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;


    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    //Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    //speed control
    document.getElementById("SpeedUp").onclick = function() {
        delay_base = delay_base / 1.2;
    }
    document.getElementById("SlowDown").onclick = function() {
        delay_base = delay_base * 1.2;
    }

    //document.getElementById("array").innerHTML = "Enter numbers here in this format: 1,2,3,4,5,6";
    document.getElementById("ShowArray").onclick = function() {


        //read text, split and convert it into numbers
        arrayString = document.getElementById("array").value;

        var numbers = arrayString.split(',');
        if (numbers.length === 0) {
            return;
        };
        arrayNumbers = [];

        for (var i = 0; i < numbers.length; i++) {
            arrayNumbers.push(parseFloat(numbers[i]));
        };


        vertices = generate_points();
        vertices_origin = vertices.slice();
        colors = generate_colors();
        colors_origin = colors.slice();

        if (FIRST_READ_FLAG)
            vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        if (FIRST_READ_FLAG)
            vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        if (FIRST_READ_FLAG)
            cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
        if (FIRST_READ_FLAG)
            vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        // set to 0 to avoid recreating Buffers
        FIRST_READ_FLAG = 0;

        algorthm_index = 0;
        one_draw();

        gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        gradient0 = ctx.createLinearGradient(0, 0, canvasWidth, 0);
        gradient0.addColorStop("0", "black");
        //gradient0.addColorStop("0.5","black");
        //gradient0.addColorStop("1.0","black");
        isBinarySearched = 0;
        isShown = 1;

    };

    //sort buttons

    document.getElementById("SelectionSort").onclick = function() {
        // call onclick function of ShowArray button
        var elem = document.getElementById("ShowArray");
        if (typeof elem.onclick == "function") {
            elem.onclick.apply(elem);
        }

        if (arrayNumbers.length != 0) {
            algorthm_index = 1;

            selection_sort();

            update_for_one_draw();
            one_draw();

        };
    }

    document.getElementById("Play").onclick = function() {
        if (isPlaying) {
            document.getElementById("Play").innerHTML = "Play";
            isPlaying = 0;
        } else {
            document.getElementById("Play").innerHTML = "Pause";
            isPlaying = 1;
            render();
        };
    }

    document.getElementById("InitialOrder").onclick = function() {
        if (algorthm_index != 0) {
            current_step = 0;
            update_for_one_draw();
            linePtr = 1;
            one_draw();
            if (algorthm_index == 5) {
                document.getElementById("num2find").value = "";
            };
        };
    }
    document.getElementById("FinalOrder").onclick = function() {
        if (algorthm_index != 0) {
            current_step = total_steps - 1;
            update_for_one_draw();
            one_draw();
            current_step = current_step + 1;

            if (algorthm_index == 4) {
                current_step -= 2;
            };
        };
    }

    document.getElementById("NextStep").onclick = function onNext() {
        if (algorthm_index != 0) {

            if (current_step + 1 < total_steps) {
                current_step = current_step + 1;
                update_for_one_draw();
                one_draw();
            };

            setTimeout( // set interval time
                function() {
                    if (!total_isMoving[current_step] || (algorthm_index == 4 && (current_step) % move_steps == 0) || (algorthm_index == 5 && (current_step - 1) % move_steps == 0) || (algorthm_index == 6 && (current_step - (returned_index_by_delete + 3)) % move_steps == 0)) {
                        return;
                    };
                    requestAnimFrame(onNext);
                }, delay
            );

        };

    }
    document.getElementById("PreviousStep").onclick = function onPrev() {
        if (algorthm_index != 0) {
            if (current_step - 1 >= 0) {
                current_step = current_step - 1;
                update_for_one_draw();
                one_draw();
            };
            setTimeout( // set interval time
                function() {
                    if (!total_isMoving[current_step] || (algorthm_index == 4 && (current_step - returned_index_by_delete - 1) % move_steps == 0) || (algorthm_index == 5 && (current_step - 3) % move_steps == 0) || (algorthm_index == 6 && (current_step - (returned_index_by_delete + 3)) % move_steps == 0)) {
                        return;
                    };
                    requestAnimFrame(onPrev);
                }, delay
            );

        };
    }

    document.getElementById("LinearSearch").onclick = function() {


        numString = document.getElementById("num2find").value;
        if (numString.length === 0 || isNaN(parseFloat(numString))) {
            alert('Please Enter a Number!!!');
            return;
        };
        // call onclick function of ShowArray button
        var elem = document.getElementById("ShowArray");
        if (typeof elem.onclick == "function") {
            elem.onclick.apply(elem);
        }
        algorthm_index = 2;
        var numIndex = linear_search(parseFloat(numString));

        update_for_one_draw();
        one_draw();

    }
    document.getElementById("BinarySearch").onclick = function() {
        numString = document.getElementById("num2find").value;
        if (numString.length === 0 || isNaN(parseFloat(numString))) {
            alert('Please enter the number you want to search for!!!');
            return;
        };
        // call onclick function of ShowArray button
        var elem = document.getElementById("ShowArray");
        if (typeof elem.onclick == "function") {
            elem.onclick.apply(elem);
        }
        //check if the array is sorted

        if (isBinarySearched) {
            algorthm_index = 3;
            current_step = 0;
            var numIndex = binary_search(parseFloat(numString));
            update_for_one_draw();
            one_draw();
        } else {
            //if (isSorted && current_step == total_steps) {
                if (isArraySorted(arrayNumbers)) {
                algorthm_index = 3;
                current_step = 0;
                var numIndex = binary_search(parseFloat(numString));
                update_for_one_draw();
                one_draw();

            } else {
                if (confirm('Array is not sorted.\n Do you want to sort it first?')) {
                    algorthm_index = 3;
                    selection_sort();
                    current_step = total_steps - 1;
                    update_for_one_draw();
                    one_draw();

                    current_step = 0;
                    var numIndex = binary_search(parseFloat(numString));
                    update_for_one_draw();
                    one_draw();
                    isBinarySearched = 1;

                } else {
                    return;
                }

            };
        }
    }

    document.getElementById("Insert").onclick = function() {
        numString = document.getElementById("num2find").value;
        if (numString.length === 0 || isNaN(parseFloat(numString))) {
            alert('Please enter the number you want to search for!!!');
            return;
        };
        indexString = document.getElementById("index2find").value;
        if (indexString.length === 0 || isNaN(parseFloat(indexString))) {
            alert('Please enter the number you want to search for!!!');
            return;
        };
        // call onclick function of ShowArray button
        var elem = document.getElementById("ShowArray");
        if (typeof elem.onclick == "function") {
            elem.onclick.apply(elem);
        }

        algorthm_index = 4;
        insert(parseFloat(numString), parseFloat(indexString));

        update_for_one_draw();
        one_draw();


    }
    document.getElementById("DeletebyLocation").onclick = function() {
        indexString = document.getElementById("index2find").value;
        if (indexString.length === 0 || isNaN(parseFloat(indexString))) {
            alert('Please enter the index of the number you want to delete!!!');
            return;
        };
        // call onclick function of ShowArray button
        var elem = document.getElementById("ShowArray");
        if (typeof elem.onclick == "function") {
            elem.onclick.apply(elem);
        }
        algorthm_index = 5;
        delete_by_location(parseFloat(indexString));
        update_for_one_draw();
        one_draw();

    }
    document.getElementById("DeletebyValue").onclick = function() {
            numString = document.getElementById("num2find").value;
            if (numString.length === 0 || isNaN(parseFloat(numString))) {
                alert('Please enter the number you want to delete!!!');
                return;
            };
            // call onclick function of ShowArray button
            var elem = document.getElementById("ShowArray");
            if (typeof elem.onclick == "function") {
                elem.onclick.apply(elem);
            }
            algorthm_index = 6;
            delete_by_value(parseFloat(numString));

            update_for_one_draw();
            one_draw();

        }
        // read codes
        // selection sort
    selection_sort_code_lines = selection_sort_code.split('\n');
    linear_search_code_lines = linear_search_code.split('\n');
    binary_search_code_lines = binary_search_code.split('\n');
    insert_code_lines = insert_code.split('\n');
    delete_by_value_code_lines = delete_by_value_code.split('\n');
    delete_by_location_code_lines = delete_by_location_code.split('\n');
}


function render() {
    if (FIRST_READ_FLAG) {
        return;
    };

    if (isPlaying) {
        current_step = current_step + 1;
        if (current_step < total_steps) {
            update_for_one_draw();
            one_draw();
        } else {
            document.getElementById("Play").innerHTML = "Play";
            isPlaying = 0;
            //current_step = 0;
            if (algorthm_index == 4) {
                current_step -= 2;
            };
            if (algorthm_index == 5) {

                document.getElementById("num2find").value = returned_value_by_delete;
            };
            if (algorthm_index == 6) {
                if (returned_index_by_delete == -1) {
                    alert('Number to be deleted is not in array!!!');
                } else {
                    current_step = current_step - 1;
                    document.getElementById("index2find").value = returned_index_by_delete;
                };

            };
        }
    }

    setTimeout( // set interval time
        function() {
            if (isPlaying == 0) {
                return;
            };
            requestAnimFrame(render);
        }, delay
    );


}

function update_for_one_draw() {
    var idx1, idx2;
    var len = arrayNumbers.length;
    idx1 = current_step * len * 4;
    idx2 = idx1 + len * 4;
    colors = total_colors.slice(idx1, idx2);
    vertices = total_vertices.slice(idx1, idx2);
    idx1 = current_step * len;
    idx2 = (current_step + 1) * len;
    arrayNumbers = total_arrayNumbers.slice(idx1, idx2);
    textPos = total_textPos.slice(idx1, idx2);

    linePtr = total_linePtr[current_step];

    isMoving = total_isMoving[current_step];
    if (isMoving == 1) {
        delay = delay_base / move_steps;
    } else {
        delay = delay_base;
    };
}

function one_draw() {


    load_colors();
    load_vertices();
    // clear webgl context for redraw
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw bars and texts on the left half
    gl.viewport(0, 0, canvas.width / 2 * 1.3, canvas.height);
    for (var i = 0; i < arrayNumbers.length; i++) {
        // draw each object as a rectangle
        gl.drawArrays(gl.TRIANGLE_FAN, i * 4, 4);
    };

    // clear 2d context for redraw
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw text/numbers
    ctx.font = '18px serif';
    var x, y;
    if (algorthm_index >= 4) {
        no_tick_index = total_no_ticks[current_step];
    };
    for (var i = 0; i < arrayNumbers.length; i++) {
        y = canvasHeight / 2 * (1 + 0.03);
        x = (textPos[i] + 1.0) * canvasWidth / 2 * 1.3 / 2;
        // if insert
        if (algorthm_index >= 4 && no_tick_index == i) {
            continue;
        } else {
            ctx.fillText(arrayNumbers[i].toString(), x, y);
        };


    };
    // draw code
    ctx.font = '12px serif';
    // show selection_sort_codes
    if (algorthm_index == 1) {
        var unitHeigth = canvasHeight * 0.8 / selection_sort_code_lines.length;
        for (var i = 0; i < selection_sort_code_lines.length; i++) {
            if (i == linePtr) {
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = gradient0;
            };
            ctx.fillText(selection_sort_code_lines[i], canvasWidth / 2 * 1.4, canvasHeight * 0.1 + unitHeigth * i);
        };
    };
    // show linear search codes
    if (algorthm_index == 2) {
        var unitHeigth = canvasHeight * 0.8 / linear_search_code_lines.length;
        for (var i = 0; i < linear_search_code_lines.length; i++) {
            if (i == linePtr) {
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = gradient0;
            };
            ctx.fillText(linear_search_code_lines[i], canvasWidth / 2 * 1.4, canvasHeight * 0.1 + unitHeigth * i);
        };
    };

    if (algorthm_index == 3) {
        var unitHeigth = canvasHeight * 0.8 / binary_search_code_lines.length;
        for (var i = 0; i < binary_search_code_lines.length; i++) {
            if (i == linePtr) {
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = gradient0;
            };
            ctx.fillText(binary_search_code_lines[i], canvasWidth / 2 * 1.4, canvasHeight * 0.1 + unitHeigth * i);
        };
    };

    if (algorthm_index == 4) {
        draw_code(4);
    };

    if (algorthm_index == 5) {
        draw_code(5);
    };
    if (algorthm_index == 6) {
        draw_code(6);
    };


}

function draw_code(idx) {
    if (idx == 4) {
        algorithm_code_lines = insert_code_lines;
    };
    if (idx == 5) {
        algorithm_code_lines = delete_by_location_code_lines;
    };
    if (idx == 6) {
        algorithm_code_lines = delete_by_value_code_lines;
    };

    var unitHeigth = canvasHeight * 0.8 / algorithm_code_lines.length;
    for (var i = 0; i < algorithm_code_lines.length; i++) {
        if (i == linePtr) {
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = gradient0;
        };
        ctx.fillText(algorithm_code_lines[i], canvasWidth / 2 * 1.4, canvasHeight * 0.1 + unitHeigth * i);
    };
}

function generate_points() {
    // only use the inner 90% of the canvas

    var margin = 0.1;
    var x_min = -1.0 * (1 - margin);
    var x_max = 1.0 * (1 - margin);
    var y_min = x_min;
    var y_max = x_max;
    var pts = [];
    var x, y;
    var unitWidth = (x_max - x_min) / (2 * arrayNumbers.length - 1);

    var max_number = arrayNumbers.reduce(function(a, b) {
        return Math.max(a, b);
    });
    var min_number = arrayNumbers.reduce(function(a, b) {
        return Math.min(a, b);
    });


    var unitHeigth = y_max / (Math.max(Math.abs(max_number), Math.abs(min_number)));
    textPos = [];
    for (var i = 0; i < arrayNumbers.length; i++) {
        //top-left
        x = x_min + unitWidth * (2 * i);
        textPos.push(x + unitWidth / 2 * 0.75);
        y = arrayNumbers[i] * unitHeigth;
        pts.push(vec2(x, y));
        //top-right
        x = x_min + unitWidth * (2 * i + 1);

        pts.push(vec2(x, y));
        //bottom_right

        y = 0;
        pts.push(vec2(x, y));
        //bottom_left
        x = x_min + unitWidth * (2 * i);

        pts.push(vec2(x, y));


    };

    return pts;

}

function generate_colors() {
    var cs = [];
    for (var i = 0; i < arrayNumbers.length; i++) {
        cs.push(vec4(0.0, 0.0, 1.0, 1.0));
        cs.push(vec4(0.0, 0.0, 1.0, 1.0));
        cs.push(vec4(0.0, 0.0, 1.0, 1.0));
        cs.push(vec4(0.0, 0.0, 1.0, 1.0));
    };
    return cs;
}

function update_total_variables() {
    total_colors = total_colors.concat(colors);
    total_arrayNumbers = total_arrayNumbers.concat(arrayNumbers);
    total_vertices = total_vertices.concat(generate_points());
    total_textPos = total_textPos.concat(textPos);
    total_steps = total_steps + 1;
}

function update_total_variables_for_move(temp_vertices, temp_Textpos) {
    total_colors = total_colors.concat(colors);
    total_arrayNumbers = total_arrayNumbers.concat(arrayNumbers);
    total_vertices = total_vertices.concat(temp_vertices);
    total_textPos = total_textPos.concat(temp_Textpos);
    total_steps = total_steps + 1;
}

function clear_all() {
    //clear total variables
    total_vertices = [];
    total_colors = [];
    total_arrayNumbers = [];
    total_steps = 0;
    current_step = 0;
    total_textPos = [];
    total_linePtr = [];
    total_isMoving = [];
}

//sort algorithms
//selection sort
function selection_sort() {

    clear_all();

    colors = colors_origin.slice();
    update_total_variables();
    // code line 0
    total_linePtr.push(1);
    total_isMoving.push(0);

    var n = arrayNumbers.length;
    var i, j, minIndex;
    for (i = 0; i < n - 1; i++) {
        minIndex = i;

        colors = colors_origin.slice();
        set_bar_color(minIndex, color_green);
        update_total_variables();
        total_linePtr.push(7);
        total_isMoving.push(0);

        for (j = i + 1; j < n; j++) {

            colors = colors_origin.slice();
            set_bar_color(minIndex, color_green);
            set_bar_color(j, color_red);
            update_total_variables();
            total_linePtr.push(9);
            total_isMoving.push(0);


            if (arrayNumbers[j] < arrayNumbers[minIndex]) {


                colors = colors_origin.slice();
                set_bar_color(minIndex, color_blue);

                minIndex = j;

                set_bar_color(minIndex, color_green);

                update_total_variables();
                total_linePtr.push(9);
                total_isMoving.push(0);

            };

        }

        //
        colors = colors_origin.slice();
        set_bar_color(minIndex, color_green);
        //set_bar_color(j, color_red);
        update_total_variables();
        total_linePtr.push(9);
        total_isMoving.push(0);


        if (minIndex != i) {

            var x1 = vertices[i * 4][0];
            var x2 = vertices[minIndex * 4][0];
            var each_step = (x2 - x1) / move_steps;

            for (var ii = 0; ii < move_steps; ii++) {

                var temp_vertices = [];
                for (var jj = 0; jj < arrayNumbers.length * 4; jj++) {
                    temp_vertices.push(vec2(vertices[jj][0], vertices[jj][1]));
                };
                temp_vertices[i * 4][0] = temp_vertices[i * 4][0] + each_step * (ii + 1);
                temp_vertices[i * 4 + 1][0] = temp_vertices[i * 4 + 1][0] + each_step * (ii + 1);
                temp_vertices[i * 4 + 2][0] = temp_vertices[i * 4 + 2][0] + each_step * (ii + 1);
                temp_vertices[i * 4 + 3][0] = temp_vertices[i * 4 + 3][0] + each_step * (ii + 1);

                temp_vertices[minIndex * 4][0] = temp_vertices[minIndex * 4][0] - each_step * (ii + 1);
                temp_vertices[minIndex * 4 + 1][0] = temp_vertices[minIndex * 4 + 1][0] - each_step * (ii + 1);
                temp_vertices[minIndex * 4 + 2][0] = temp_vertices[minIndex * 4 + 2][0] - each_step * (ii + 1);
                temp_vertices[minIndex * 4 + 3][0] = temp_vertices[minIndex * 4 + 3][0] - each_step * (ii + 1);

                var temp_Textpos = [];

                for (var jj = 0; jj < arrayNumbers.length; jj++) {
                    temp_Textpos.push(textPos[jj]);
                };

                temp_Textpos[i] = temp_Textpos[i] + each_step * (ii + 1);
                temp_Textpos[minIndex] = temp_Textpos[minIndex] - each_step * (ii + 1);

                // 

                update_total_variables_for_move(temp_vertices, temp_Textpos);
                total_linePtr.push(13);
                total_isMoving.push(1);


            };

            swap(i, minIndex);
            vertices = generate_points();

            /*
            colors = colors_origin.slice();
            set_bar_color(i, color_green);
            update_total_variables();
            total_isMoving.push(0);*/
        };
    }

    // add the final state
    colors = colors_origin.slice();
    update_total_variables();
    total_linePtr.push(19);
    total_isMoving.push(0);

    isSorted = 1;
}
// linear search
function linear_search(num2find) {

    //
    clear_all();

    colors = colors_origin.slice();
    update_total_variables();
    total_linePtr.push(1);
    total_isMoving.push(0);

    for (var i = 0; i < arrayNumbers.length; i++) {

        colors = colors_origin.slice();
        set_bar_color(i, color_red);
        update_total_variables();
        total_linePtr.push(4);
        total_isMoving.push(0);

        if (arrayNumbers[i] == num2find) {
            colors = colors_origin.slice();
            set_bar_color(i, color_green);
            update_total_variables();
            total_linePtr.push(6);
            total_isMoving.push(0);

            colors = colors_origin.slice();
            set_bar_color(i, color_green);
            update_total_variables();
            total_linePtr.push(9);
            total_isMoving.push(0);

            return i;
        }
    };
    colors = colors_origin.slice();

    update_total_variables();
    total_linePtr.push(8);
    total_isMoving.push(0);
    colors = colors_origin.slice();

    update_total_variables();
    total_linePtr.push(9);
    total_isMoving.push(0);

    return -1;
}
// binary search
function binary_search(num2find) {
    clear_all();

    colors = colors_origin.slice();
    update_total_variables();
    total_linePtr.push(1);
    total_isMoving.push(0);


    var start = 0;
    var last = arrayNumbers.length - 1;
    while (start <= last) {
        var middle = Math.floor((start + last) / 2);
        colors = colors_origin.slice();

        set_bar_color(start, color_yellow);
        set_bar_color(last, color_yellow);
        set_bar_color(middle, color_red);
        update_total_variables();
        total_linePtr.push(6);
        total_isMoving.push(0);


        if (num2find == arrayNumbers[middle]) {
            colors = colors_origin.slice();
            set_bar_color(middle, color_green);
            update_total_variables();
            total_linePtr.push(8);
            total_isMoving.push(0);

            colors = colors_origin.slice();
            set_bar_color(middle, color_green);
            update_total_variables();
            total_linePtr.push(16);
            total_isMoving.push(0);

            return middle;
        }
        if (num2find > arrayNumbers[middle]) {
            start = middle + 1;
        } else {
            last = middle - 1;
        }
    }

    colors = colors_origin.slice();

    update_total_variables();
    total_linePtr.push(15);
    total_isMoving.push(0);
    colors = colors_origin.slice();

    update_total_variables();
    total_linePtr.push(16);
    total_isMoving.push(0);


    return -1;

}
//insert
function insert(toAdd, location) {


    if (location >= 0 && location < arrayNumbers.length) {
        total_no_ticks = [];
        clear_all();
        // add zero first for animation
        arrayNumbers.push(0);
        vertices = generate_points();
        vertices_origin = vertices.slice();
        colors = generate_colors();
        colors_origin = colors.slice();
        update_total_variables();
        total_linePtr.push(1);
        total_isMoving.push(0);

        total_no_ticks.push(arrayNumbers.length - 1);

        for (var i = arrayNumbers.length - 1; i > location; i--) {
            //generate info for moving two bars
            swap_bars(i - 1, i);
            for (var j = 0; j < move_steps; j++) {
                total_no_ticks.push(i);
                total_linePtr.push(9);
            };



            //arrayNumbers[i] = arrayNumbers[i-1];
            swap(i - 1, i);
            vertices = generate_points();


        };
        // add the real number
        arrayNumbers[location] = toAdd;
        vertices = generate_points();
        set_bar_color(location, color_green);
        total_no_ticks.push(-1);
        total_linePtr.push(12);
        total_isMoving.push(0);
        update_total_variables();
        total_no_ticks.push(-1);
        total_linePtr.push(19);
        total_isMoving.push(0);
        update_total_variables();

    } else {
        alert('The location is out of boundary,\n New item can not be added!!!');
    };
}
// algorithm_index=5
function delete_by_location(location) {

    if (location >= 0 && location < arrayNumbers.length) {
        document.getElementById("num2find").value = "";
        returned_value_by_delete = arrayNumbers[location];
        total_no_ticks = [];
        clear_all();
        //set the bar at location to be green
        vertices = generate_points();
        colors = generate_colors();
        total_linePtr.push(1);
        total_isMoving.push(0);
        total_no_ticks.push(-1);
        update_total_variables();
        //set value at location be 0
        arrayNumbers[location] = 0;
        vertices = generate_points();
        vertices_origin = vertices.slice();
        colors = generate_colors();
        colors_origin = colors.slice();
        update_total_variables();
        total_linePtr.push(1);
        total_isMoving.push(0);
        total_no_ticks.push(location);
        // move bars
        for (var i = location; i < arrayNumbers.length - 1; i++) {
            //generate info for moving two bars
            swap_bars(i, i + 1);
            for (var j = 0; j < move_steps; j++) {
                total_no_ticks.push(i);
                if (algorthm_index == 4) {
                    total_linePtr.push(8);
                } else {
                    total_linePtr.push(8);
                };

            };
            //arrayNumbers[i] = arrayNumbers[i-1];
            swap(i, i + 1);
            vertices = generate_points();
        };
        //delete the 0  in the end, make sure arrayNumbers.lenght decrease by 1
        //arrayNumbers.pop();
        total_linePtr.pop();
        total_linePtr.push(16);


    } else {
        alert('The location is out of boundary,\n New item can not be deleted!!!');
    }
}

function delete_by_value(value) {

    returned_index_by_delete = -1;
    clear_all();
    total_no_ticks = [];
    // linear search
    var num2find = value;
    colors = generate_colors();
    vertices = generate_points();
    update_total_variables();
    total_linePtr.push(1);
    total_isMoving.push(0);
    total_no_ticks.push(-1);

    for (var i = 0; i < arrayNumbers.length; i++) {

        colors = colors_origin.slice();
        set_bar_color(i, color_red);
        update_total_variables();
        total_linePtr.push(6);
        total_isMoving.push(0);
        total_no_ticks.push(-1);
        if (arrayNumbers[i] == num2find) {
            colors = colors_origin.slice();
            set_bar_color(i, color_green);
            update_total_variables();
            total_linePtr.push(8);
            total_isMoving.push(0);
            total_no_ticks.push(-1);

            returned_index_by_delete = i;
            break;
        }
    };




    if (returned_index_by_delete == -1) {
        vertices = generate_points();
        colors = generate_colors();
        update_total_variables();
        total_isMoving.push(0);
        total_no_ticks.push(-1);
        total_linePtr.push(23);
        return;
    }

    // delete by location

    //set value at location be 0
    var location = returned_index_by_delete;

    arrayNumbers[location] = 0;
    vertices = generate_points();
    colors = generate_colors();
    update_total_variables();
    total_linePtr.push(15);
    total_isMoving.push(0);
    total_no_ticks.push(location);
    // move bars
    for (var i = location; i < arrayNumbers.length - 1; i++) {
        //generate info for moving two bars
        swap_bars(i, i + 1);
        for (var j = 0; j < move_steps; j++) {
            total_no_ticks.push(i);
            total_linePtr.push(15);

        };
        //arrayNumbers[i] = arrayNumbers[i-1];
        swap(i, i + 1);
        vertices = generate_points();
    };
    //delete the 0  in the end, make sure arrayNumbers.lenght decrease by 1
    //arrayNumbers.pop();
    total_linePtr.pop();
    total_linePtr.push(23);
}
//6
function delete_by_value2(value) {
    var index = arrayNumbers.indexOf(value);
    if (index == -1) {
        alert(value.toString() + " is not in array!!!");
        return;
    };

    document.getElementById("num2find").value = "";
    algorthm_index = 6;
    delete_by_location(index);
    returned_index_by_delete = index;
}
// save vertices needed to swap two bars
function swap_bars(idx1, idx2) {
    var x1 = vertices[idx1 * 4][0];
    var x2 = vertices[idx2 * 4][0];
    var each_step = (x2 - x1) / move_steps;

    for (var ii = 0; ii < move_steps; ii++) {

        var temp_vertices = [];
        for (var jj = 0; jj < arrayNumbers.length * 4; jj++) {
            temp_vertices.push(vec2(vertices[jj][0], vertices[jj][1]));
        };
        temp_vertices[idx1 * 4][0] = temp_vertices[idx1 * 4][0] + each_step * (ii + 1);
        temp_vertices[idx1 * 4 + 1][0] = temp_vertices[idx1 * 4 + 1][0] + each_step * (ii + 1);
        temp_vertices[idx1 * 4 + 2][0] = temp_vertices[idx1 * 4 + 2][0] + each_step * (ii + 1);
        temp_vertices[idx1 * 4 + 3][0] = temp_vertices[idx1 * 4 + 3][0] + each_step * (ii + 1);

        temp_vertices[idx2 * 4][0] = temp_vertices[idx2 * 4][0] - each_step * (ii + 1);
        temp_vertices[idx2 * 4 + 1][0] = temp_vertices[idx2 * 4 + 1][0] - each_step * (ii + 1);
        temp_vertices[idx2 * 4 + 2][0] = temp_vertices[idx2 * 4 + 2][0] - each_step * (ii + 1);
        temp_vertices[idx2 * 4 + 3][0] = temp_vertices[idx2 * 4 + 3][0] - each_step * (ii + 1);

        var temp_Textpos = [];

        for (var jj = 0; jj < arrayNumbers.length; jj++) {
            temp_Textpos.push(textPos[jj]);
        };

        temp_Textpos[idx1] = temp_Textpos[idx1] + each_step * (ii + 1);
        temp_Textpos[idx2] = temp_Textpos[idx2] - each_step * (ii + 1);

        // 

        update_total_variables_for_move(temp_vertices, temp_Textpos);
        //total_linePtr.push(13);
        total_isMoving.push(1);
    };
}


function isArraySorted(arrNums) {
    var sum = 0;
    for (var i = 0; i < arrNums.length - 1; i++) {
        if (arrNums[i] <= arrNums[i + 1]) {
            sum = sum + 0
        };
        if (arrNums[i] >= arrNums[i + 1]) {
            sum = sum + 1
        };
    };
    if (sum == arrNums.length || sum == 0) {
        return 1
    };

    return 0;
}


// swap two elements in an array according to indice i and j
function swap(i, j) {
    var temp = arrayNumbers[i];
    arrayNumbers[i] = arrayNumbers[j];
    arrayNumbers[j] = temp;
}

function set_bar_color(bar_index, color) {
    colors[bar_index * 4] = color;
    colors[bar_index * 4 + 1] = color;
    colors[bar_index * 4 + 2] = color;
    colors[bar_index * 4 + 3] = color;
}

function load_colors() {
    if (FIRST_READ_FLAG)
        cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    if (FIRST_READ_FLAG)
        vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function load_vertices() {
    if (FIRST_READ_FLAG)
        vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    if (FIRST_READ_FLAG)
        vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// codes
let insert_code = `
void Insert(int list[], int &numOfItems, int toAdd, int location)
{
    int i;
    // check the location is in the valid index range
    if (location>=0 && location <= numbOfItems 
        && numOfItems<ARRAY_SIZE) {
        // shift all the values to accommodate the new item 
        for (i=numOfItems; i>location; i--) {
            list[i] = list[i-1]; 
        }
        // add the new item 
        list[location] = toAdd;
        numOfItems++;
    } 
    else {
        cerr << "The location is out of boundary" << endl;
        cerr << "new item can not be added" << endl; 
    }
}//done
`;

let delete_by_location_code = `
void DeleteByLocation(int list[], int &numOfItems, int location)
{
    int i;
    // check the location is in the valid index range
    if ((location>=0 && location < numbOfItems)) {
        // remove the item by shifting the items
        for (i=location; i<numberOfItems-1; i++) {
            list[i] = list[i+1]; 
        }
        numOfItems --;
    }
    else {
        cerr << "The location is out of boundary." << endl;
        cerr << "The item can not be deleted." << endl; 
    }
}//done
`;

let delete_by_value_code = `
void DeleteByValue(int list[], int &numOfItems, int value)
{
    int i;
    int location = -1;
    // check the value  in the valid index range
    for (i=0; i<numberOfItems; i++){
        if (list[i] == value){
            location = i;
            break;
        }
    }
    if ((location>=0 && location < numbOfItems)) {
        // remove the item by shifting the items
        for (i=location; i<numberOfItems-1; i++) {
            list[i] = list[i+1]; 
        }
        numOfItems --;
    }
    else {
        cerr << "The location is out of boundary." << endl;
        cerr << "The item can not be deleted." << endl; 
    }
}//done
`;
let selection_sort_code = `
void SelectionSort(int arr[], int n) {
    int i, j, minIndex, tmp;
    // repeat pair-wise comparison across the elements n-1 times
    for (i = 0; i < n - 1; i++) {
        // find the index of the element with the smallest value
        // in the remaining elements
        minIndex = i;
        for(j=i+1;j<n;j++) {
            if (arr[j] < arr[minIndex])
                minIndex = j;
        }
        // swap arr[i] and arr[minIndex]
        if (minIndex != i) {
            tmp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = tmp;
        }
    }
}//done
`;

let linear_search_code = `
int LinearSearch (const int a[], int aSize, int toFind)
{
    // Look through all items, starting at the front.
    for (int i = 0; i < aSize; i++) {
        if (a[i] == toFind)
            return i;
    }// You've gone through the whole list without success.
    return -1; 
}//done
`;
let binary_search_code = `
int BinarySearch(const int a[], int aSize, int toFind)
{
    int start = 0; //the search starts with index 0
    int last = aSize -1; //last is the last array index
    while (start <= last) { //while there is still a place to look.
        int middle = (start + last) / 2; //Look here first
        if (toFind == a[middle])         //Found item. Quit.
            return middle;  
    if (toFind > a[middle])              //Look in the last half
        start = middle + 1;
    else                                 //OR look in the first half
        last = middle - 1;
    }
    //the element wasn't found
    return -1; 
}//done
`;
