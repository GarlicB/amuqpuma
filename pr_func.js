var execSync = require('child_process').execSync;
var https = require('https');

module.exports.cmd = function(value) {
  try {
    return execSync(value).toString().replace(/\n/g, "");
  } catch (err) {
  }
};

module.exports.gh_api =function(v_mtd, v_path, v_id, v_pw, v_data) {
    var request = https.request({
      auth: v_id+':'+v_pw, // ****에는 여러분들의 비밀번호를 넣습니다.
      hostname: 'api.github.com',
      path: v_path,
      method: v_mtd,
      headers: {
        'User-Agent': 'Node js',
        'Content-Type': 'application/json'
      }
    }, function(response) {
      var body = "";
      response.on('data', function(contents) {
        body += contents;
      });
      response.on('end', function() {
        var result = JSON.parse(body.toString());
        var status = response.statusCode;

        if(v_data === 'token' && status === 201){
        exports.cmd('git config --local --remove-section PAT');
        execSync('git config --local --add PAT.User ' + v_id);
        execSync('git config --local --add PAT.Token ' + result.token);
      }
      else if (v_data === 'user' && status !== 200){
        exports.cmd('git config --local --remove-section PAT');
      }

      //console.log(response.statusCode);
      console.log(status);
      console.log(result);
      });
    });

    request.on('error', function(e) {
      console.log("Error!", e.message);
    });

    if (v_data !== null) {
      var d={};
      if (v_data === 'token') {
        d = {
          "note": "Token_Absolute",
          "scopes": "repo"
        };
      }
      else if (v_data !== 'token') {
        d=v_data;
        console.log(d);
      }
          request.write(JSON.stringify(d));
    }

    request.end();
  };
