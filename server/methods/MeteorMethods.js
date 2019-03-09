import {check} from "meteor/check";
import axios from 'axios'
import * as github from "octonode/lib/octonode";

Meteor.methods({
    getServerDate() {
        return new Date()
    },
    async sendIssue(issueObj) {
        check(issueObj, {
            title: String,
            body: String
        })
        check(Meteor.userId(), String)
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
