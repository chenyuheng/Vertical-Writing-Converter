var text;
var height = 16;
var is_converting_punctuation = true;
var is_converting_to_traditional_Chinese = false;
var dict = new Map();

function convert_text(original_text) {
    if (original_text.length == 0) {
        return "";
    }
    let char_list = [];
    let i;
    for (i = 0; i < original_text.length; i += height) {
        char_list.push(original_text.substring(i, i + height));
    }
    char_list[char_list.length - 1] = char_list[char_list.length - 1] + "\u3000".repeat(height - char_list[char_list.length - 1].length);
    let vertical_text = "";
    for (i = 0; i < height; i++) {
        let line = "";
        let j;
        for (j = 0; j < char_list.length; j++) {
            line = "\u3000" + char_list[j].charAt(i) + line;
        }
        vertical_text += line + "\n";
        console.log(line);
    }
    return vertical_text;
}

function convert_to_fullwidth(original_text) {
    let fullwidth_text = "";
    let i;
    for (i = 0; i < original_text.length; i++) {
        if (original_text.charCodeAt(i) == 32) {
            fullwidth_text += String.fromCharCode(12288);
        } else if (original_text.charCodeAt(i) < 127 && original_text.charCodeAt(i) > 32) {
            fullwidth_text += String.fromCharCode(original_text.charCodeAt(i) + 65248);
        } else {
            fullwidth_text += original_text.charAt(i);
        }
    }
    return fullwidth_text;
}

function convert_punctuations(original_text) {
    let converted_text = "";
    let i;
    for (i = 0; i < original_text.length; i++){
        if (dict.has(original_text.charAt(i))) {
            converted_text += dict.get(original_text.charAt(i));
        } else {
            converted_text += original_text.charAt(i);
        }
    }
    return converted_text;
}

function initiate() {
    document.getElementById("original_text").value = "前有一樽酒行（其一）\n" +
        "春风东来忽相过，金樽渌酒生微波。落花纷纷稍觉多，美人欲醉朱颜酡。青轩桃李能几何，流光欺人忽蹉砣。君起舞，日西夕，当年意气不肯平，白发如丝叹何益。\n" +
        "            ——李白";
    document.getElementById("height_input").value = height;
    document.getElementById("height_number").innerText = height;
    document.getElementById("is_converting_punctuation").checked = true;
    document.getElementById("is_converting_to_traditional_Chinese").checked = false;
    text = document.getElementById("original_text").value;
    initiate_dict();
    convert_and_display();
}

function initiate_dict() {
    dict.set('‘','﹁');
    dict.set('’','﹂');
    dict.set('“','﹃');
    dict.set('”','﹄');
    dict.set('《','︽');
    dict.set('》','︾');
    dict.set('〈','︿');
    dict.set('〉','﹀');
    dict.set('（','⌢');
    dict.set('）','⌣');
    dict.set('—','|');
}

function refresh() {
    text = document.getElementById("original_text").value;
    height = parseInt(document.getElementById("height_input").value);
    document.getElementById("height_number").innerText = height;
    is_converting_punctuation = document.getElementById("is_converting_punctuation").checked;
    is_converting_to_traditional_Chinese = document.getElementById("is_converting_to_traditional_Chinese").checked;
    convert_and_display();
}

function convert_and_display() {
    let lines = text.split("\n");
    let i;
    let parsed_text = "";
    for (i = 0; i < lines.length; i++) {
        parsed_text += lines[i] + ((lines[i].length % height == 0) ? "" : "\u3000".repeat(height - lines[i].length % height));
    }
    if (is_converting_punctuation) {
        parsed_text = convert_punctuations(parsed_text);
    }
    if (is_converting_to_traditional_Chinese) {
        parsed_text = s2t(parsed_text);
    }
    let vertical_text = convert_text(convert_to_fullwidth(parsed_text));
    document.getElementById("vertical_text").innerText = vertical_text;
}

document.getElementById("original_text").addEventListener("keyup", refresh);
document.getElementById("is_converting_punctuation").addEventListener("click", refresh);
document.getElementById("height_input").addEventListener("mousemove", refresh);
document.getElementById("height_input").addEventListener("touchmove", refresh);
document.getElementById("is_converting_to_traditional_Chinese").addEventListener("click", refresh);

function copy() {
    navigator.clipboard.writeText(document.getElementById("vertical_text").innerText).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}