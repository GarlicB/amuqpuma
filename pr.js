var func = require('./pr_func');
var readline = require('readline');

var TOKEN = func.cmd('git config --local --get PAT.Token');
var USER_ID = func.cmd('git config --local --get PAT.User');
var BR_O = func.cmd('git symbolic-ref --short HEAD');
var HEAD;

var r = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//질문 1, pr 혹은 cp를 입력해주세요
r.question('Please enter "pr" or "cp" : ', (a1) => {
  if (a1 === 'pr') {
    //질문 2-1-1 pr이면, 토큰 검사, 되면 OK 아니면 id pw 물어봄
    if (TOKEN === undefined) {
      console.log('Only the first attempt require your ID and password.');
      r.question('Please enter your ID : ', (a211) => {
        r.question('Please enter yout PW : ', (a212) => {
          func.gh_api('POST', '/authorizations', a211, a212, 'token');
          r.close();
        });
      });
    }
    //질문 2-1-2 풀리퀘스트 title, body 받는다. (브랜치 확인)
    else {
      r.question('title : ', (a221) => {
        r.question('contents : ', (a222) => {
          r.question(BR_O + 'brnach in GarlicB/amuqpuma? (y/n) : ', (a223) => {

            if (a223 === 'y')
              HEAD = 'GarlicB';
            else if (a223 === 'n')
              HEAD = USER_ID;

            var pr = {
              "title": a221,
              "body": a222,
              "head": HEAD + ':' + BR_O,
              "base": 'master'
            };

            func.gh_api('POST', '/repos/GarlicB/amuqpuma/pulls', USER_ID, TOKEN, pr);
            r.close();
          });
        });
      });
    }
  }
  // 질문 2-2-1 cp면, 플리퀘스트 숫자를 받는다.
  else if (a1 === 'cp') {
    r.question('#num : ', (a231) => {
   func.cmd('git pull https://github.com/GarlicB/amuqpuma pull/'+ a231 +'/head:pr-'+ a231);
   r.close();
   });
  }

  else {
    func.gh_api('GET', '/user', USER_ID, TOKEN, 'user');
    r.close();
  }
});
