import {renderShortname} from "emojitsu";
import Autolinker from 'autolinker';
import urlParser from "js-video-url-parser";

Template.smartContent.helpers({
    //add you helpers here
    smartifiedContent: function () {
        let instance = Template.instance()
        Meteor.setTimeout(() => {
            if (instance.data.refreshScrollbar) {
                instance.data.refreshScrollbar()
            }
            if(Meteor.isCordova){
                $(".smartifiedContent a").click(function() {
                    let href= $(this).attr("href")

                        // external url

                        window.open(encodeURI(href), '_system');


                })
            }

        }, 200)
        return Autolinker.link(renderShortname(Template.currentData().content, {
            size: 32, // size of emojis to use when the default CDN is used
            className: "emojiImg", // CSS class to use when rendering image tags
            unsafe: false, // when set to true, render will NOT sanitize the string, e.g. it forces "unsafe" output
            single: false, // when a string contains just a single emoji this speeds render a bit
            cdn: undefined, // a CDN to use for image paths
        }))
    },
    linkPreview: function () {
        let instance = Template.instance()
        Meteor.setTimeout(() => {
            if (instance.data.refreshScrollbar) {
                instance.data.refreshScrollbar()
            }
        }, 200)
        return Template.instance().linkPreview.get()

    },
    videoEmbedUrl: function () {
        let instance = Template.instance()
        Meteor.setTimeout(() => {

            if (instance.data.refreshScrollbar) {
                instance.data.refreshScrollbar()
            }
        }, 200)
        return urlParser.create({
            videoInfo: Template.instance().videoInfo.get(),
            format: 'embed'
        })

    }
});

Template.smartContent.events({
    //add your events here
});

Template.smartContent.onCreated(function () {
    //add your statement here
    this.linkPreview = new ReactiveVar(false)
    this.videoInfo = new ReactiveVar(false)

});

Template.smartContent.onRendered(function () {
    //add your statement here
    let content = this.data.content
    let regexUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    let firstUrl = null
    let videoUrl = null
    let instanceLinkPreview = this.linkPreview

    content.split(" ").forEach(sequence => {
        if (sequence.match(regexUrl)) {
            if (!videoUrl && urlParser.parse(sequence)) {
                videoUrl = urlParser.parse(sequence)
                this.videoInfo.set(videoUrl)

            } else if (!firstUrl) {
                firstUrl = sequence
            }
        }
    })


    function getMetaContent(html, name) {
        return html.filter(
            (index, tag) => tag && tag.name && tag.name == name).attr('content');
    }

    function getMetaByProperty(html, property) {
        return html.filter(
            (index, tag) => {
                return tag && tag.tagName === "META" && $(tag).attr("property") === property

            })
            .attr('content');
    }

    if (firstUrl &&
        (!instanceLinkPreview.get() ||
            instanceLinkPreview.get().title !== firstUrl
        )) {
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/' + firstUrl
        }).then(function (data) {
            let html = $(data)
            let linkPreview = {
                siteUrl: firstUrl,
                description: getMetaByProperty(html, "og:description") || getMetaContent(html, 'description'),
                title: getMetaByProperty(html, "og:title") || null,
                img: getMetaByProperty(html, "og:image") || html.find('img').attr('src'),

            }

            if (linkPreview.img && linkPreview.description) {
                if (linkPreview.description.length > 120) {
                    linkPreview.description = linkPreview.description.substring(0, 119) + "..."
                }
                if (!linkPreview.img.match(regexUrl)) {
                    let pathArray = linkPreview.siteUrl.split('/');
                    let protocol = pathArray[0];
                    let host = pathArray[2];
                    let mainPath = protocol + '//' + host;
                    linkPreview.img = mainPath + '/' + linkPreview.img.substring(linkPreview.img.indexOf('/') + 1)
                    console.log(linkPreview.img)
                }
                instanceLinkPreview.set(linkPreview)


            }
        });
    }
});

Template.smartContent.onDestroyed(function () {
    //add your statement here
});

