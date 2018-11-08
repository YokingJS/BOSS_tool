// 最低期望薪资
const EXPECT_MIN = 20;
// 允许最少工龄(包含)
const WORKTIME_MIN = 2;
// 允许最大工龄(包含)
const WORKTIME_MAX = 9;

// 存放候选人
let usefullPersons = [];
// 是否由确认框
let hasConfirm = false;

// 删除元素下多余节点
let deleteEmptyNode = (elem) => {
    let newElem = elem;
    let elem_child = newElem.childNodes;
    for(let i = 0; i < elem_child.length; i++){
        if(elem_child[i].nodeName === "#text" && /\s/.test(elem_child[i].nodeValue)|| elem_child[i].nodeName === "#comment") {
            newElem.removeChild(elem_child[i]);
            i--;
        }
    }
    return newElem;
}

// 自动打招呼
let mainTalk = () => {
    
    let buttons = document.getElementsByTagName('button');
    // 根据按钮找出符合条件的候选人
    if (buttons && buttons.length) {
        for (let i = 0, l = buttons.length; i < l; i++) {
            let item = buttons[i];
            if (item.innerHTML === '打招呼') {
                let thisPerson = deleteEmptyNode(item.parentNode.parentNode);
                let information = deleteEmptyNode((deleteEmptyNode(thisPerson.childNodes[1])).childNodes[0]).childNodes;
                let informationObj = {};
                for (let i = 0, l = information.length; i < l; i++) {
                    let nodeItem = information[i];
                    let innerHTML = nodeItem.innerHTML;
                    if (innerHTML && innerHTML.match(/(d)*年/)) informationObj.workTime = parseInt(innerHTML, 10);
                    if (innerHTML && innerHTML.match(/科|士/)) informationObj.education = innerHTML;
                    if (innerHTML && innerHTML.match(/岁/)) informationObj.age = innerHTML;
                }
                // 排除学历/工作经验不符合的
                if (
                    !(informationObj.education && informationObj.education.match(/士|本|研究/))
                    || informationObj.workTime > WORKTIME_MAX
                    || informationObj.workTime < WORKTIME_MIN
                ) continue;

                let salaryFatherNode = deleteEmptyNode((deleteEmptyNode(thisPerson.childNodes[1])).childNodes[1]).childNodes[0];
                let salary = (deleteEmptyNode(salaryFatherNode).childNodes[2]).innerHTML;
                salary = i === 10 ? '面议' : salary;
                let salaryArray = salary && salary.split('-');
                if (salaryArray && salaryArray.length > 1) {
                    // 期望薪资低于20K，排除
                    if(parseInt(salaryArray[0], 10) < EXPECT_MIN || parseInt(salaryArray[1], 10) < EXPECT_MIN) continue;
                }
                usefullPersons.push(item);
            }
        }
    }
    
    // 1.5秒打一次招呼
    let interval = setInterval(() => {
        if (!usefullPersons || usefullPersons.length === 0 ) {
            clearInterval(interval);
            document.getElementById('container').scrollTop = 2000000;
            setTimeout(() => {
                mainTalk();
            }, 2500);
            return;
        }

        if (hasConfirm) {
            clearInterval(interval);
            return;
        }

        let willClick = usefullPersons[0] && usefullPersons[0].click && usefullPersons[0];
        willClick.click();

        let targetHeight = (usefullPersons[0].parentNode.parentNode).offsetTop;

        document.getElementById('container').scrollTop = targetHeight;

        usefullPersons.shift();
    },1500);
    
};

mainTalk();

// 如果超过打招呼上限，自动确认
setInterval(() => {
    // 自动点击确认框
    let confirm = document.getElementsByClassName('jconfirm-box');
    if(confirm && confirm.length) {
        hasConfirm = true;
        for (let i = 0, l = confirm.length; i < l; i++) {
            let confirmItem = confirm[i];
            let buttonBox = deleteEmptyNode(confirmItem).childNodes[3];
            let button = buttonBox && deleteEmptyNode(buttonBox).childNodes[0];
            button.click();
            console.log('已经超过打招呼上限了');
        }
    }

}, 2000);




