var test;
var Flatform;
var Q;
var R = [];
var question, answer, score = 0, init_score;
var K = [];
var E = [];
var K_E = {};
var K_ans = {};
var E_ans = {};
var S = {};
var part_selected = {}, lng_selected, type_selected;
var flg;

window.onresize = function(event){
    if (document.getElementsByTagName('body')[0].clientHeight<450){
        document.getElementById("select").style.paddingTop = "0";
    }
    else{
        document.getElementById("select").style.paddingTop = "13vh";
    }
}

function Part_visible(){
    document.getElementById("part_select_box").style.display = "block";
    document.getElementById("part_select_box").focus();
}
function Check(elm){
    var key = elm.parentElement.parentElement.id;
    var value = elm.parentElement.innerText.substring(2);
    if (elm.checked===true){
        if (part_selected.length === 0){
            part_selected[key].push(value);
        }
        else if (key in part_selected){
            part_selected[key].push(value);
        }
        else{
            part_selected[key] = [value];
        }
    }
    else{
        var idx = part_selected[key].indexOf(value);
        part_selected[key].splice(idx, 1);
        if (part_selected[key].length === 0){
            delete part_selected[key];
        }
    }
}
function Disable(){
    if (document.getElementById("select-type").value === 'sentence'){
        document.getElementById("select-lng").disabled = 'disabled';
    }
    else{
        document.getElementById("select-lng").disabled = false;
    }
}
function All(){
    part_selected = {};
    for (check_part of document.getElementsByClassName("part_label")){
        check_part.firstElementChild.checked = true;
        Check(check_part.firstElementChild);
    }
}

function Reset(){
    for (check_part of document.getElementsByClassName("part_label")){
        if (check_part.firstElementChild.checked){
            check_part.firstElementChild.checked = false;
        }
    }
    part_selected = {};
}

function Enter(){
    var keys = Object.keys(part_selected).sort(function(a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
    });
    for (p of Object.keys(part_selected)){
        part_selected[p].sort(function(a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
        });
    }
    lng_selected = document.getElementById("select-lng").value;
    type_selected = document.getElementById("select-type").value;
    var message = "Type: ";
    if (type_selected === "word"){
        message += "단어\n";
    }
    else if (type_selected === "sentence"){
        message += "문장\n";
    }
    for (p of keys){
        message += p + ": " + part_selected[p].join(", ") + '\n';
    }
    message += "START?"
    if (confirm(message)){}
    else{
        return;
    }
    var Text = '';
    for (p of Object.keys(part_selected)){
        for (t of part_selected[p]){
            var src = "#" + type_selected + "_" + p.replace(/ /gi, '')+ "_" +t.replace(/ /gi, '');
            Text += $(src).contents().find("pre").html();
        }
    }
    Build_list(Text);
    if (type_selected === "word") {
        Q = K;
    }
    else if (type_selected === "sentence") {
        var U = [];
        for (s of Object.keys(S)){
            for (i=0;i<S[s].length;i++){
                U.push(s+i);
            }
        }
        Q = U;
    }
    score = 0;
    init_score = Q.length;
    shuffle(Q);
    Question();
}

function Build_list(Text){
    K = []; E = []; K_E = {}; K_ans = {}; S = {};
    var i=0;
    while (i < Text.length){
        if (Text[i] === '\r'){
            Text = Text.substring(0,i)+Text.substring(i+1);
            i--;
        }
        i++;
    }
    Text = Text.split('\n');
    if (type_selected === "word"){
        var ln = 'K';
        var pf;
        for (f of Text){
            if (f === ''){
                break;
            }
            if (ln === 'K'){
                K.push(f);
                ln = 'E';
                if (lng_selected === "KOREAN"){
                    K_ans[f] = Manufact_K(f);
                }
                pf = f;
            }
            else{
                E.push(f);
                K_E[pf] = f;
                ln = 'K';
                if (lng_selected === "ENGLISH"){
                    E_ans[f] = Manufact_E(f);
                }
            }
        }
    }
    else if (type_selected === "sentence"){
        var tg = 0;
        var pt;
        var j = 0;
        for (f of Text){
            if (tg === 0){
                pt = f;
                S[pt] = [];
            }
            else if (tg === 1){
                S[pt].push([f]);
            }
            else if (tg === 2){
                S[pt][j].push(f);
            }
            else if (tg === 3){
                S[pt][j].push(f);
            }
            else if (tg === 4){
                if (f === ''){
                    tg = 0;
                    j = 0;
                    continue;
                }
                else{
                    S[pt].push([f]);
                    tg = 2;
                    j++;
                    continue;
                }
            }
            tg++;
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

function Manufact_E(Text){
    var U = '';
    var con = [];
    var i = 0;
    for (f of Text){
        if (f === "~"){
            con.push([i,1]);
        }
        else if (f === "." && Text.substring(i,i+3) === "..."){
            con.push([i,3]);
        }
        i++;
    }
    if (con.length !== 0){
        var j = 0;
        for (c of con){
            U += Text.substring(j, c[0]-1);
            j = c[0]+c[1];
        }
        return [Text, U];
    }
    else{
        return [Text];
    }
}

function shuffle(array) { array.sort(() => Math.random() - 0.5); }
function Indexof(str, searchvalue){
    var result = [];
    var i = 0;
    while (i+searchvalue.length <= str.length){
        if (str.substr(i, searchvalue.length) === searchvalue){
            result.push(i);
        }
        i++;
    }
    return result;
}

function Question(){
    if (type_selected === "word"){
        document.getElementById("question").style.fontSize = "23.5px";
        document.getElementById("question").style.fontWeight= "bold";
        if (lng_selected === "ENGLISH"){
            question = Q[0];
            answer = E_ans[K_E[Q[0]]];
            document.getElementById("question").innerHTML = question;
            document.getElementById("input-answer").value='';
            document.getElementById("input-answer").placeholder='';
            document.getElementById("input-answer").focus();
        }
        else if (lng_selected === "KOREAN"){
            question = K_E[Q[0]];
            answer = K_ans[Q[0]];
            document.getElementById("question").innerHTML = question;
            document.getElementById("input-answer").value='';
            document.getElementById("input-answer").placeholder='';
            document.getElementById("input-answer").focus();
        }
    }
    else if (type_selected === "sentence"){
        document.getElementById("question").style.fontSize = "15px";
        document.getElementById("question").style.fontWeight= "bold";
        var U = S[Q[0].substring(0, Q[0].length-1)][Q[0].substring(Q[0].length-1)];
        question = U[0] + "<br><br>" + U[1];
        answer = U[2];
        console.log(answer);
        document.getElementById("question").innerHTML = question;
        document.getElementById("input-answer").value='';
        document.getElementById("input-answer").placeholder='';
        document.getElementById("input-answer").focus();
    }
}

var opt = 0;
function Input(){
    var ans = document.getElementById("input-answer").value;
    if (ans === '') {
        alert(Q.length+"개 남았습니다.");
    }
    else if (ans === "dvl"){
        document.getElementById("count").style.display = "block";
        document.getElementById("develop").innerHTML = window.innerHeight+' '+window.innerWidth;
        setTimeout(function(){
            document.getElementById("count").style.display = "none";
            document.getElementById("develop").innerHTML = '';
        },3000);
    }

    else if (ans === 'S'){
        return Skip();
    }
    else if (ans === 'H'){
        return Hint();
    }
    else{
    if (type_selected === "word"){
        if (answer.includes(ans)){
            alert("SUCCESS");
            opt = 0;
            score += 1;
            Q.shift();
            if (Q.length === 0){
                return Complete();
            }
            return Question();
        }
        else{
            if (lng_selected === "KOREAN"){
                var F = false;
                for (a of answer){
                    if (ans.replace(/ /gi, '') === a.replace(/ /gi, '')){
                        F = true;
                    }
                }
                if (F === true){
                    alert("띄어쓰기를 확인해주세요.");
                    return;
                }
            }
            document.getElementById("input-answer").value='';
            opt += 1;
            if (opt === 3){
                alert("FAILURE\n3번 모두 실패하셨습니다.");
                return Skip();
            }
            else{
                var message = "FAILURE\n남은 기회: " + (3-opt);
                alert(message);
            }
        }
    }
    else if (type_selected === "sentence"){
        console.log(ans, answer);
        ans = ans.split(" ");
        var U = [];
        var U_a = answer.split(" ");
        var i = 0;
        var j = 0;
        for (a of ans){
            if (U_a.slice(j).includes(a)){
                U.push(U_a.indexOf(a));
                j += 1;
            }
            i++;
        }
        if (U.length === 0){
            document.getElementById("input-answer").value='';
            opt += 1;
            if (opt === 3){
                alert("FAILURE\n3번 모두 실패하셨습니다.");
                return Skip();
            }
            else{
                var message = "FAILURE\n남은 기회: " + (3-opt);
                alert(message);
            }
        }
        else if (U.length === U_a.length){
            alert("SUCCESS");
            opt = 0;
            score += 1;
            Q.shift();
            if (Q.length === 0){
                return Complete();
            }
            return Question();
        }
        else{
            console.log(U);
            for (u of U){
                var n = Indexof(question, "___")[u];
                console.log(n);
                document.getElementById("input-answer").value='';
                question = question.substring(0, n) + U_a[u] + question.substring(n+3);
                document.getElementById("question").innerHTML = question;
                alert("더 쓰시오.");
                U_a.splice(u, 1);
            }
            answer = U_a.join(" ");
        }
    }
    }
}

function Complete(){
    document.getElementById("question").innerHTML='';
    document.getElementById("input-answer").value='';
    var message = '';
    message += "총 개수: " + init_score + "\n"
    message += "맞힌 개수: " + score;
    if (score === init_score){
        alert(message);
    }
    else{
        message += "\n틀린 개수: " + (init_score-score);
        message += "\nRESTART?"
        if (confirm(message)){}
        else{
            return;
        }
        score = 0;
        init_score = R.length;
        Q = R;
        R = [];
        Question();
    }
}

function Skip(){
    if (type_selected === "word"){
        alert("정답: "+answer[0]);
    }
    else if (type_selected === "sentence"){
        alert("정답: "+answer);
    }
    opt = 0;
    R.push(Q[0]);
    Q.shift();
    if (Q.length === 0){
        return Complete();
    }
    return Question();
}

function Hint(){
    document.getElementById("input-answer").value = '';
    if (type_selected === "word"){
        document.getElementById("input-answer").placeholder =
            answer[0].substring(0, document.getElementById("input-answer").placeholder.length+1);
    }
    else if (type_selected === "sentence"){
        document.getElementById("input-answer").placeholder =
            answer.substring(0, document.getElementById("input-answer").placeholder.length+1);
    }
    document.getElementById("input-answer").focus();
}
