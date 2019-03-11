import {check} from "meteor/check";
import axios from 'axios'
import * as github from "octonode/lib/octonode";
import svgCaptcha from 'svg-captcha'
import cryptoServer from "../../imports/cryptoServer";

Meteor.methods({
    getServerDate() {
        return new Date()
    },
    getCaptcha(){
        let captcha = svgCaptcha.create({
            size: 4, // size of random string
            ignoreChars: '0o1ilIOjJL', // filter out some characters like 0o1i
            noise: 1, // number of noise lines
            color: true, // characters will have distinct colors instead of grey, true if background option is set
            background: '#1E272C',
            width: 110, // width of captcha
            height:40,
            fontSize:45
        });
        captcha.text= cryptoServer.fastHash(captcha.text)
        return captcha
    },
    async sendIssue(issueObj, captcha) {
        check(issueObj, {
            title: String,
            body: String
        })

        if(!Meteor.userId()){
            check(captcha,{
                userInput: String,
                hashControl:String
            } )
            check((cryptoServer.fastHash(captcha.userInput)===captcha.hashControl), true)
        }
        let client = github.client(Meteor.settings.githubToken);
        let ghrepo = client.repo('HUB-HUmanBeing/SystemD');
        let callWithPromise = new Promise((resolve, reject) => {
            ghrepo.issue(issueObj, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    resolve(res.html_url)
                }
            });
        })

        return await callWithPromise
    }
})
