import {renderShortname} from "emojitsu";
import Autolinker from 'autolinker';

Template.smartContent.helpers({
    //add you helpers here
    smartifiedContent: function () {
        let content = Template.currentData().content
        let regexUrl = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        let firstUrl = null
        let instanceLinkPreview = Template.instance().linkPreview
        content.split(" ").forEach(sequence => {
            if (!firstUrl && sequence.match(regexUrl)) {
                firstUrl = sequence
            }
        })

        function getMetaContent(html, name) {
            return html.filter(
                (index, tag) => tag && tag.name && tag.name == name).attr('content');
        }

        if (firstUrl &&
            (!instanceLinkPreview.get() ||
                instanceLinkPreview.get().title !== firstUrl
            )) {
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + firstUrl
            }).then(function (data) {
                let html = $(data);
                let linkPreview = {
                    description: getMetaContent(html, 'description'),
                    title: firstUrl,
                    img: html.find('img').attr('src')
                }

                if (linkPreview.img && linkPreview.description) {
                    if (linkPreview.description.length > 150) {
                        linkPreview.description = linkPreview.description.substring(0, 149) + "..."
                    }
                    console.log(linkPreview.img)
                    if (!linkPreview.img.match(regexUrl)) {
                        let pathArray = linkPreview.title.split('/');
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

        return Autolinker.link(renderShortname(content, {
            size: 32, // size of emojis to use when the default CDN is used
            className: "emojiImg", // CSS class to use when rendering image tags
            unsafe: false, // when set to true, render will NOT sanitize the string, e.g. it forces "unsafe" output
            single: false, // when a string contains just a single emoji this speeds render a bit
            cdn: undefined, // a CDN to use for image paths
        }))
    },
    linkPreview: function () {
        if(Template.instance().linkPreview.get()){
            Template.currentData().refreshScrollbar()
        }
        return Template.instance().linkPreview.get()
    }
});

Template.smartContent.events({
    //add your events here
});

Template.smartContent.onCreated(function () {
    //add your statement here
    this.linkPreview = new ReactiveVar(false)
});

Template.smartContent.onRendered(function () {
    //add your statement here
});

Template.smartContent.onDestroyed(function () {
    //add your statement here
});

