var test;
var Flatform;
var Q;
var Q_dup;
var R = [];
var R_dup = {};
var question, answer, answer_stn, score = 0, init_score;
var K = [];
var E = [];
var D = {};
var K_E = {};
var K_ans = {};
var E_ans = {};
var S = {};
var part_selected = {}, lng_selected, type_selected;
var flg;
var dup = -1;
var message = '';

window.addEventListener('DOMContentLoaded', function(event){
    var Height = window.innerHeight
    document.getElementById("question_box").style.minHeight = Height*16/100 + "px";
    document.getElementById("select").style.minHeight = Height*9/100 + "px";
    document.getElementById("select").style.paddingTop = Height*13/100 + "px";
    document.getElementById("answer_box").style.paddingBottom = Height*2/100 + "px";

})

window.onresize = function(event){
    if (document.getElementsByTagName('body')[0].clientHeight<450){
        document.getElementById("select").style.paddingTop = "0";
    }
    else{
        document.getElementById("select").style.paddingTop = "13vh";
    }
}

var clicked = false;
var visible = true;
function Part_visible(){
    if (visible === true){
        document.getElementById("part_select_box").style.display = "block";
        document.getElementById("part_select_box").focus();
    }
    else{
        visible = true;
    }
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
    if (document.getElementById("select-type").value === "sentence"){
        document.getElementById("select-lng").disabled = "disabled";
        document.getElementById("select-lng").value = "ENGLISH"
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
        check_part.firstElementChild.checked = false;
    }
    part_selected = {};
}

var label_click = true;
function Part_all(part){
    var f = true;
    for (check_part of document.getElementsByClassName(part.replace(/ /gi,''))){
        if (check_part.firstElementChild.checked === false){
            f = false;
            check_part.firstElementChild.checked = true;
            Check(check_part.firstElementChild);
        }
    }
    if (f === true){
        for (check_part of document.getElementsByClassName(part.replace(/ /gi,''))){
            check_part.firstElementChild.checked = false;
            Check(check_part.firstElementChild);
        }
    }
}

function Enter(){
    document.getElementById("question").innerHTML = '';
    document.getElementById("input-answer").value='';
    document.getElementById("input-answer").placeholder='';
    var dict = {};
    var keys = Object.keys(part_selected).sort();
    for (k of keys){
        var c = [];
        for (t of part_selected[k]){
            c.push(parseInt(t.split(" ")[1]));
        }
        var d = c.slice();
        d.sort(function(a, b){ return a-b; });
        var u = [];
        for (e of d){
            u.push(part_selected[k][c.indexOf(e)]);
        }
        dict[k] = u;
    }
    part_selected = dict;
    keys = Object.keys(part_selected);

    lng_selected = document.getElementById("select-lng").value;
    type_selected = document.getElementById("select-type").value;

    message = "Type: ";
    if (type_selected === "word"){
        message += "단어\n\n";
    }
    else if (type_selected === "sentence"){
        message += "문장\n\n";
    }
    var not_Uld = {}
    for (p of keys){
        for (t of part_selected[p]){
            var s = "#" + type_selected + "_" + p.replace(/ /gi, '')+ "_" +t.replace(/ /gi, '');
            if ($(s).length === 0){
                if (Object.keys(not_Uld).includes(p) === true){
                    not_Uld[p].push(t);
                }
                else{
                    not_Uld[p] = [t];
                }
            }
        }
    }
    if (Object.keys(not_Uld).length !== 0){
        var not_uploaded = '※아직 업로드되지 않았습니다.※\n\n';
        for (p of Object.keys(not_Uld)){
            not_uploaded += p + ": " + not_Uld[p].join(", ") + '\n';
            for (t of not_Uld[p]){
                document.getElementById("Ch"+p.replace(/ /gi,'')+t.replace(/ /gi,'')).firstElementChild.checked = false;
                Check(document.getElementById("Ch"+p.replace(/ /gi,'')+t.replace(/ /gi,'')).firstElementChild);
            }
        }
        alert(not_uploaded);
    }
    keys = Object.keys(part_selected);
    if (keys.length === 0){
        return;
    }
    for (p of keys){
        message += p + ": " + part_selected[p].join(", ") + '\n';
    }
    if (confirm(message)){}
    else{
        return;
    }
    if (type_selected === "word" && lng_selected === "KOREAN"){
        message = "※정답 양식※\n" +
            "「,」: ex) 요소, 성분 → 요소 or 성분 or 요소, 성분 | 아무거나\n" +
            "「;」: ex) 빗질하다; 빗 → 빗질하다, 빗다 | 둘 다 모두\n" +
            "「()」: ex) 보호(소) → 보호 or 보호소\n" +
            "「[]」: ex) 배제[제외]하다 → 배제하다 or 제외하다\n" +
            "「,」로 구분하여 작성해 주세요.";
        alert(message);
    }
    else if (type_selected === "sentence"){
        message = "빈칸에 올바른 단어를 작성해 주세요.\n\n" +
            "※참고※\n" +
            "___ 2개 이상: 빈칸의 단어 중 아무거나 순서대로\n" +
            "ex) make the most of의 정답 양식:\n" +
            "     → make | make most | most of | · · ·\n" +
            "띄어쓰기로 구분하여 작성해 주세요.";
        alert(message);
    }
    var Text = '';
    for (p of keys){
        for (t of part_selected[p]){
            var src = "#" + type_selected + "_" + p.replace(/ /gi, '')+ "_" +t.replace(/ /gi, '');
            Text += $(src).contents().find("pre").html();
            if (type_selected === "sentence"){
                Text += "\n";
            }
        }
    }
    Build_list(Text);
    if (type_selected === "word") {
        Q = K.slice();
        Q_dup = {...D};
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
    var i = 0;
    Text = Text.split(/\n|\r/);
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
                if (pf in K_E){
                    if (typeof(K_E[pf]) === "string"){
                        K_E[pf] = [K_E[pf], f];
                        D[pf]='';
                    }
                    else{
                        K_E[pf].push(f)
                    }
                }
                else{
                    K_E[pf] = f;
                }
                ln = 'K';
                if (lng_selected === "ENGLISH"){
                    E_ans[f] = Manufact_E(f);
                }
            }
        }
        var a = 0;
        while (true){
            if (a >= Object.keys(D).length){
                break;
            }
            var d = Object.keys(D)[a];
            var dl = K_E[d].length;
            K_E[d] = new Set(K_E[d]);
            K_E[d] = [...K_E[d]];
            dl -= K_E[d].length;
            var c = 0;
            var b = 0;
            while (true){
                if (c === dl){
                    break;
                }
                if (K[b] === d){
                    K.splice(b,1);
                    c++;
                    continue;
                }
                b++;
            }
            if (K_E[d].length === 1){
                K_E[d] = K_E[d][0];
                delete D[d];
                continue;
            }
            var l = 0;
            while (true){
                var f = true;
                for (i=0;i<K_E[d].length;i++){
                    var com = K_E[d][i].slice(0,l);
                    var C = K_E[d].slice(0,i).concat(K_E[d].slice(i+1));
                    for (k of C){
                        if (k.slice(0,l) === com){
                            f = false;
                        }
                    }
                }
                if (f === true){
                    K_E[d].push(l);
                    break;
                }
                else{
                    l++;
                }
            }
            D[d] = K_E[d];
            a++;
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
    var pre = [[]];
    var result;
    var U = '';
    var a = 0;
    var b = 0;
    var c = 0;
    while (true){
        if (a >= Text.length){
            pre[c].push(U);
            break;
        }
        else if (Text[a] === ';'){
            pre[c].push(U);
            U = '';
            a++;
            c += 1;
            pre.push([]);
        }
        else if (Text[a] === ',' && b === 0){
            pre[c].push(U);
            U = '';
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
    for (k=0; k<result.length; k++){
        var t = 0;
        while (t !== result[k].length){
            var T = result[k][t]
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
                    r1 = r1.substring(0, r1.length-1);
                }
                else if (con['()'][1]+1 < T.length && T[con['()'][1]+1] === ' '){
                    r2 = r2.substring(1);
                }
                r4 = r1+r2;
                result[k].push(r3);
                result[k].push(r4);
                result[k].shift();
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
                result[k].push(r3);
                result[k].push(r4);
                result[k].shift();
                t--;
            }
            t++;
        }
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
        document.getElementById("input-answer").placeholder='';
        if (lng_selected === "ENGLISH"){
            question = Q[0];
            if (typeof(K_E[Q[0]]) === "object"){
                var r = [];
                for (i=0;i<Q_dup[Q[0]].length-1;i++){
                    r.push(i);
                }
                shuffle(r);
                dup = r[0];
                answer = E_ans[Q_dup[Q[0]][dup]];
                document.getElementById("input-answer").placeholder=Q_dup[Q[0]][dup].slice(0,Q_dup[Q[0]][Q_dup[Q[0]].length-1]);
            }
            else{
                dup = -1;
                answer = E_ans[K_E[Q[0]]];
            }
            document.getElementById("question").innerHTML = question;
            document.getElementById("input-answer").value='';
            document.getElementById("input-answer").focus();
        }
        else if (lng_selected === "KOREAN"){
            question = K_E[Q[0]];
            answer = Q[0];
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
        question = U[0] + "<br><br>" + U[1].replace(/_/gi,'');
        answer = U[2];
        answer_stn = answer;
        console.log(answer);
        document.getElementById("question").innerHTML = question;
        document.getElementById("input-answer").value='';
        document.getElementById("input-answer").placeholder='';
        document.getElementById("input-answer").focus();
    }
}

var oprt = 0;
function Input(){
    var ans = document.getElementById("input-answer").value;
    if (ans === '') {
        alert(Q.length+"개 남았습니다.");
    }
    else if (ans === "dvl"){
        document.getElementById("count").style.display = "block";
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
        if (type_selected === "word") {
            if (lng_selected === "ENGLISH"){
                if (answer.includes(ans)) {
                    Success()
                }
                else{
                    document.getElementById("input-answer").value = '';
                    oprt += 1;
                    if (oprt === 3) {
                        alert("FAILURE\n3번 모두 실패하셨습니다.");
                        return Skip();
                    } else {
                        message = "FAILURE\n남은 기회: " + (3 - oprt);
                        alert(message);
                    }
                }
            }
            else if (lng_selected === "KOREAN"){
                ans = ans.split(/, |,/);
                var T = true;
                var scr = 0;
                for (ans_i of ans){
                    var t = false;
                    for (A of K_ans[answer]){
                        for (a of A){
                            if (ans_i === a) {
                                t = true;
                                scr++;
                                break;
                            }
                        }
                        if (t === true){
                            break;
                        }
                    }
                    if (t === false){
                        T = false;
                    }
                }
                if (T === true && scr === K_ans[answer].length){
                    Success()
                }
                else{
                    var F = true;
                    var scr_ = 0;
                    for (ans_i of ans){
                        var f = false;
                        for (A of K_ans[answer]) {
                            for (a of A){
                                if (ans_i.replace(/ /gi, '') === a.replace(/ /gi, '')) {
                                    f = true;
                                    scr_++;
                                    break;
                                }
                            }
                            if (f === true){
                                break;
                            }
                        }
                        if (f === false){
                            F = false;
                        }
                    }
                    if (F === true && scr_ === K_ans[answer].length) {
                        alert("띄어쓰기를 확인해주세요.");
                    }
                    else{
                        document.getElementById("input-answer").value = '';
                        oprt += 1;
                        if (oprt === 3){
                            alert("FAILURE\n3번 모두 실패하셨습니다.");
                            return Skip();
                        }
                        else{
                            message = "FAILURE"
                            if (K_ans[answer].length >= 2){
                                message += "\n전체 개수: " + K_ans[answer].length + "\n맞은 개수: " + scr_;
                            }
                            message += "\n남은 기회: " + (3 - oprt);
                            alert(message);
                        }
                    }
                }
            }
        }
        else if (type_selected === "sentence") {
            ans = ans.split(" ");
            var U = [];
            var U_a = answer.split(" ");
            var i = 0;
            var j = 0;
            for (a of ans) {
                if (U_a.slice(j).includes(a)) {
                    U.push(U_a.indexOf(a));
                    j += 1;
                }
                i++;
            }
            if (U.length === 0 || (U_a.length === 1 && U.length !== 1)) {
                if (ans.join(" ").toLowerCase() === answer.toLowerCase()){
                    alert('대소문자를 확인해 주세요.');
                    return;
                }
                document.getElementById("input-answer").value = '';
                oprt += 1;
                if (oprt === 3) {
                    alert("FAILURE\n3번 모두 실패하셨습니다.");
                    return Skip();
                } else {
                    message = "FAILURE\n남은 기회: " + (3 - oprt);
                    alert(message);
                }
            } else if (U.length === U_a.length) {
                Success()
            } else {
                var U_s = [];
                var k = 0
                for (u of U) {
                    console.log(u);
                    var n = Indexof(question, "___")[u-k];
                    document.getElementById("input-answer").value = '';
                    question = question.substring(0, n) + U_a[u-k] + question.substring(n + 3);
                    U_s.push(U_a.splice(u-k, 1));
                    k++;
                }
                document.getElementById("question").innerHTML = question;
                message = U_s.join(", ") + " 정답!";
                message += "\n\n더 작성해 주세요."
                alert(message);
                answer = U_a.join(" ");
            }
        }
    }
}

function Success(){
    message = '정답: ';
    if (type_selected === "word"){
        if (lng_selected === "ENGLISH"){
            message += answer[0];
        }
        else if (lng_selected === "KOREAN"){
            message += answer;
        }
    }
    else if (type_selected === "sentence"){
        message += answer_stn;
    }
    message += "\n\n정답입니다!";
    alert(message);
    oprt = 0;
    hint = 0;
    score += 1;
    if (dup !== -1){
        Q_dup[Q[0]].splice(dup,1);
    }
    Q.shift();
    if (Q.length === 0) {
        return Complete();
    }
    return Question();
}

function Complete(){
    document.getElementById("question").innerHTML='';
    document.getElementById("input-answer").value='';
    message = '';
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
        Q = R.slice();
        Q_dup = {...R_dup};
        R = [];
        R_dup = {};
        Question();
    }
}

function Skip(){
    if (type_selected === "word"){
        if (lng_selected === "ENGLISH"){
            alert("정답: "+answer[0]);
        }
        else if (lng_selected === "KOREAN"){
            alert("정답: "+answer);
        }
    }
    else if (type_selected === "sentence"){
        alert("정답: "+answer_stn);
    }
    oprt = 0;
    hint = 0;
    R.push(Q[0]);
    if (dup !== -1){
        if (Q[0] in R_dup){
            R_dup[Q[0]].splice(R_dup[Q[0]].length-2,0,Q_dup[Q[0]][dup]);
        }
        else{
            R_dup[Q[0]] = [Q_dup[Q[0]][dup], Q_dup[Q[0]][Q_dup[Q[0]].length-1]];
        }
        Q_dup[Q[0]].splice(dup,1);
    }
    Q.shift();
    if (Q.length === 0){
        return Complete();
    }
    return Question();
}
var hint = 0;
function Hint(){
    hint++;
    document.getElementById("input-answer").value = '';
    if (type_selected === "word"){
        if (lng_selected === "ENGLISH"){
            document.getElementById("input-answer").placeholder =
                answer[0].substring(0, document.getElementById("input-answer").placeholder.length+1);
        }
        else if (lng_selected === "KOREAN"){
            document.getElementById("input-answer").placeholder =
                answer.substring(0, document.getElementById("input-answer").placeholder.length+1);
        }
    }
    else if (type_selected === "sentence"){
        if (hint === 2){
            var U = S[Q[0].substring(0, Q[0].length-1)][Q[0].substring(Q[0].length-1)];
            var R = '';
            var tg = 0;
            for (u of U[1]){
                if (u === "_"){
                    if (tg === 0){
                        R += "<big><u>";
                        tg++;
                    }
                    else{
                        R += "</u></big>"
                        tg--;
                    }
                }
                else{
                    R += u;
                }
            }
            question = U[0] + "<br><br>" + R;
            document.getElementById("question").innerHTML = question;
        }
        else{
            document.getElementById("input-answer").placeholder =
                answer.substring(0, document.getElementById("input-answer").placeholder.length+1);
        }
    }
    document.getElementById("input-answer").focus();
}
