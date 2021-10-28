
var Flatform;
var Q;
var question, answer, score = 0, init_score;
var K = [];
var E = [];
var K_E = {};
var K_ans = {};
var part_selected, lng_selected, type_selected;
var flg;

var count;

window.onresize = function(event){
    if (document.getElementsByTagName('body')[0].clientHeight<450){
        document.getElementById("select").style.paddingTop = "0";
    }
    else{
        document.getElementById("select").style.paddingTop = "13vh";
    }
}

function Enter(){
    var rawFile = new XMLHttpRequest();
    part_selected = document.getElementById("select-part");
    lng_selected = document.getElementById("select-lng");
    type_selected = document.getElementById("select-type");
    if (confirm("Part: "+part_selected.value+"\nSTART?")){}
    else{
        return;
    }
    var src = "src/word/"+part_selected.value+".txt";
    var Text;
    rawFile.open("GET", src, true);
    rawFile.onreadystatechange = function(){
        if (rawFile.readyState === rawFile.DONE){
            if (rawFile.status === 200){
                Text = rawFile.responseText;
                Build_list(Text);
                Q = K;
                init_score = Q.length;
                shuffle(Q);
                Question();
            }
        }
    }
    rawFile.send();
}

function Build_list(Text){
    var i=0;
    while (i < Text.length){
        if (Text[i] === '\r'){
            Text = Text.substring(0,i)+Text.substring(i+1);
            i--;
        }
        i++;
    }
    Text = Text.split('\n');
    var ln = 'K';
    var pf;
    for (f of Text){
        if (f === ''){
            break;
        }
        if (ln === 'K'){
            K.push(f);
            ln = 'E';
            K_ans[f] = Manufact_K(f);
            pf = f;
        }
        else{
            E.push(f);
            K_E[pf] = f;
            ln = 'K';
        }
    }
}
function Manufact_K(Text){
    var pre = [];
    var result;
    var U = '';
    var a = 0;
    var b = 0;
    while (true){
        if (a >= Text.length){
            pre.push(U);
            break;
        }
        else if (Text[a] === ',' && b === 0){
            pre.push(U);
            a++;
        }
        else{
            if (Text[a] === '(' || Text[a] === '['){
                b = 1;
            }
            else if (Text[a] === ')' || Text[a] === ']'){
                b = 0;
            }
            U += Text[a];
        }
        a++;
    }
    result = pre;
    var t = 0;
    while (t !== result.length){
        var T = result[t]
        var con = {'()': [], '[]': []};
        var r1, r2, r3, r4;

        var i = 0;
        var f;
        for (f of T){
            if (f === '(' || f === ')'){
                con['()'].push(i);
            }
            else if (f === '[' || f === ']'){
                con['[]'].push(i);
            }
            i++;
        }
        if (con['()'].length !== 0){
            r1 = T.substring(0, con['()'][0]);
            r2 = T.substring(con['()'][1]+1);
            r3 = r1+T.substring(con['()'][0]+1, con['()'][1])+r2;
            if (con['()'][0]-1 >= 0 && T[con['()'][0]-1] === ' '){
                r1 = r1.substring(0, r1.length-2);
            }
            else if (con['()'][1]+1 < T.length && T[con['()'][1]+1] === ' '){
                r2 = r2.substring(1);
            }
            r4 = r1+r2;
            result.push(r3);
            result.push(r4);
            result.shift();
            continue;
        }

        if (con['[]'].length !== 0){
            var j =  con['[]'][0];
            while (true){
                j--;
                if (T[j] === ' ' || j === 0){
                    if (j === 0){
                        j--;
                    }
                    break;
                }
            }
            r1 = T.substring(0,j+1);
            r2 = T.substring(con['[]'][1]+1);
            r3 = r1 + T.substring(j+1, con['[]'][0]) + r2;
            r4 = r1 + T.substring(con['[]'][0]+1,con['[]'][1])+r2;
            result.push(r3);
            result.push(r4);
            result.shift();
            t--;
        }
        t++;
    }
    return result;
}

function shuffle(array) { array.sort(() => Math.random() - 0.5); }

function Question(){
    if (lng_selected.value === "ENGLISH"){
        question = Q[0];
        answer = K_E[Q[0]];
        document.getElementById("question").innerHTML = question;
        document.getElementById("input-answer").value='';
        document.getElementById("input-answer").placeholder='';
        document.getElementById("input-answer").focus();
    }
}

function Input(){
    var ans = document.getElementById("input-answer").value;
    if (ans === '') {
        alert(Q.length+"개 남았습니다.");
    }
    else if (ans === 'S') {
        return Skip();
    }
    else if (ans === 'H') {
        return Hint();
    }
    else if (ans === answer){
        alert("success");
        score += 1;
        Q.shift();
        if (Q.length === 0){
            return Complete();
        }
        return Question();
    }
    else{
        alert('failure');
        document.getElementById("input-answer").value='';
    }
}
function Complete(){
    alert(init_score+"개 중 "+score+"개 정답")
    document.getElementById("question").innerHTML='';
    document.getElementById("input-answer").value='';
}

function Skip(){
    alert("정답: "+answer);
    Q.shift();
    if (Q.length === 0){
        return Complete();
    }
    return Question();
}

function Hint(){
    document.getElementById("input-answer").value='';
    document.getElementById("input-answer").placeholder=
        answer.substring(0, document.getElementById("input-answer").placeholder.length+1);
    document.getElementById("input-answer").focus();
}