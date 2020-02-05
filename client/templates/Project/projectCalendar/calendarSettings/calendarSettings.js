import projectController from "../../../../lib/controllers/projectController";
import Activity from "../../../../../imports/classes/Activity";
import cryptoTools from "../../../../lib/cryptoTools";
import Project from "../../../../../imports/classes/Project";
import ical from "ical"
import moment from "../../../../lib/i18nMoment";

/*! ics.js Wed Aug 20 2014 17:23:02 */
var saveAs = saveAs || function (e) {
    "use strict";
    if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return
    }
    var t = e.document, n = function () {
            return e.URL || e.webkitURL || e
        }, r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"), o = "download" in r, a = function (e) {
            var t = new MouseEvent("click");
            e.dispatchEvent(t)
        }, i = /constructor/i.test(e.HTMLElement) || e.safari, f = /CriOS\/[\d]+/.test(navigator.userAgent),
        u = function (t) {
            (e.setImmediate || e.setTimeout)(function () {
                throw t
            }, 0)
        }, s = "application/octet-stream", d = 1e3 * 40, c = function (e) {
            var t = function () {
                if (typeof e === "string") {
                    n().revokeObjectURL(e)
                } else {
                    e.remove()
                }
            };
            setTimeout(t, d)
        }, l = function (e, t, n) {
            t = [].concat(t);
            var r = t.length;
            while (r--) {
                var o = e["on" + t[r]];
                if (typeof o === "function") {
                    try {
                        o.call(e, n || e)
                    } catch (a) {
                        u(a)
                    }
                }
            }
        }, p = function (e) {
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
                return new Blob([String.fromCharCode(65279), e], {type: e.type})
            }
            return e
        }, v = function (t, u, d) {
            if (!d) {
                t = p(t)
            }
            var v = this, w = t.type, m = w === s, y, h = function () {
                l(v, "writestart progress write writeend".split(" "))
            }, S = function () {
                if ((f || m && i) && e.FileReader) {
                    var r = new FileReader;
                    r.onloadend = function () {
                        var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                        var n = e.open(t, "_blank");
                        if (!n) e.location.href = t;
                        t = undefined;
                        v.readyState = v.DONE;
                        h()
                    };
                    r.readAsDataURL(t);
                    v.readyState = v.INIT;
                    return
                }
                if (!y) {
                    y = n().createObjectURL(t)
                }
                if (m) {
                    e.location.href = y
                } else {
                    var o = e.open(y, "_blank");
                    if (!o) {
                        e.location.href = y
                    }
                }
                v.readyState = v.DONE;
                h();
                c(y)
            };
            v.readyState = v.INIT;
            if (o) {
                y = n().createObjectURL(t);
                setTimeout(function () {
                    r.href = y;
                    r.download = u;
                    a(r);
                    h();
                    c(y);
                    v.readyState = v.DONE
                });
                return
            }
            S()
        }, w = v.prototype, m = function (e, t, n) {
            return new v(e, t || e.name || "download", n)
        };
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function (e, t, n) {
            t = t || e.name || "download";
            if (!n) {
                e = p(e)
            }
            return navigator.msSaveOrOpenBlob(e, t)
        }
    }
    w.abort = function () {
    };
    w.readyState = w.INIT = 0;
    w.WRITING = 1;
    w.DONE = 2;
    w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null;
    return m
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs
} else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
    define("FileSaver.js", function () {
        return saveAs
    })
}

var ics = function (e, t) {
    "use strict";
    {
        if (!(navigator.userAgent.indexOf("MSIE") > -1 && -1 == navigator.userAgent.indexOf("MSIE 10"))) {
            void 0 === e && (e = "default"), void 0 === t && (t = "Calendar");
            var r = -1 !== navigator.appVersion.indexOf("Win") ? "\r\n" : "\n", n = [],
                i = ["BEGIN:VCALENDAR", "PRODID:" + t, "VERSION:2.0"].join(r), o = r + "END:VCALENDAR",
                a = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
            return {
                events: function () {
                    return n
                }, calendar: function () {
                    return i + r + n.join(r) + o
                }, addEvent: function (t, i, o, l, u, s) {
                    if (void 0 === t || void 0 === i || void 0 === o || void 0 === l || void 0 === u) return !1;
                    if (s && !s.rrule) {
                        if ("YEARLY" !== s.freq && "MONTHLY" !== s.freq && "WEEKLY" !== s.freq && "DAILY" !== s.freq) throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
                        if (s.until && isNaN(Date.parse(s.until))) throw"Recurrence rrule 'until' must be a valid date string";
                        if (s.interval && isNaN(parseInt(s.interval))) throw"Recurrence rrule 'interval' must be an integer";
                        if (s.count && isNaN(parseInt(s.count))) throw"Recurrence rrule 'count' must be an integer";
                        if (void 0 !== s.byday) {
                            if ("[object Array]" !== Object.prototype.toString.call(s.byday)) throw"Recurrence rrule 'byday' must be an array";
                            if (s.byday.length > 7) throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
                            s.byday = s.byday.filter(function (e, t) {
                                return s.byday.indexOf(e) == t
                            });
                        }
                    }
                    var g = new Date(l), d = new Date(u), f = new Date,
                        S = ("0000" + g.getFullYear().toString()).slice(-4),
                        E = ("00" + (g.getMonth() + 1).toString()).slice(-2),
                        v = ("00" + g.getDate().toString()).slice(-2), y = ("00" + g.getHours().toString()).slice(-2),
                        A = ("00" + g.getMinutes().toString()).slice(-2),
                        T = ("00" + g.getSeconds().toString()).slice(-2),
                        b = ("0000" + d.getFullYear().toString()).slice(-4),
                        D = ("00" + (d.getMonth() + 1).toString()).slice(-2),
                        N = ("00" + d.getDate().toString()).slice(-2), h = ("00" + d.getHours().toString()).slice(-2),
                        I = ("00" + d.getMinutes().toString()).slice(-2),
                        R = ("00" + d.getMinutes().toString()).slice(-2),
                        M = ("0000" + f.getFullYear().toString()).slice(-4),
                        w = ("00" + (f.getMonth() + 1).toString()).slice(-2),
                        L = ("00" + f.getDate().toString()).slice(-2), O = ("00" + f.getHours().toString()).slice(-2),
                        p = ("00" + f.getMinutes().toString()).slice(-2),
                        Y = ("00" + f.getMinutes().toString()).slice(-2), U = "", V = "";
                    y + A + T + h + I + R != 0 && (U = "T" + y + A + T, V = "T" + h + I + R);
                    var B, C = S + E + v + U, j = b + D + N + V, m = M + w + L + ("T" + O + p + Y);
                    if (s) if (s.rrule) B = s.rrule; else {
                        if (B = "rrule:FREQ=" + s.freq, s.until) {
                            var x = new Date(Date.parse(s.until)).toISOString();
                            B += ";UNTIL=" + x.substring(0, x.length - 13).replace(/[-]/g, "") + "000000Z"
                        }
                        s.interval && (B += ";INTERVAL=" + s.interval), s.count && (B += ";COUNT=" + s.count), s.byday && s.byday.length > 0 && (B += ";BYDAY=" + s.byday.join(","))
                    }
                    (new Date).toISOString();
                    var H = ["BEGIN:VEVENT", "UID:" + n.length + "@" + e, "CLASS:PUBLIC", "DESCRIPTION:" + i, "DTSTAMP;VALUE=DATE-TIME:" + m, "DTSTART;VALUE=DATE-TIME:" + C, "DTEND;VALUE=DATE-TIME:" + j, "LOCATION:" + o, "SUMMARY;LANGUAGE=en-us:" + t, "TRANSP:TRANSPARENT", "END:VEVENT"];
                    return B && H.splice(4, 0, B), H = H.join(r), n.push(H), H
                }, download: function (e, t) {
                    if (n.length < 1) return !1;
                    t = void 0 !== t ? t : ".ics", e = void 0 !== e ? e : "calendar";
                    var a, l = i + r + n.join(r) + o;
                    if (-1 === navigator.userAgent.indexOf("MSIE 10")) a = new Blob([l]); else {
                        var u = new BlobBuilder;
                        u.append(l), a = u.getBlob("text/x-vCalendar;charset=" + document.characterSet)
                    }
                    return saveAs(a, e + t), l
                }, build: function () {
                    return !(n.length < 1) && i + r + n.join(r) + o
                }
            }
        }
        console.log("Unsupported Browser")
    }
};

Template.calendarSettings.helpers({
    //add you helpers here
    colorLegendCallback: function () {
        let instance = Template.instance()
        return function (encryptedColorLegends) {
            instance.data.project.callMethod("editCalendarLegend",
                projectController.getAuthInfo(instance.data.project._id),
                encryptedColorLegends,
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                    }
                })
        }
    },
    durationOptions: function () {
        return [
            {
                value: 1,
                label: "1 " + __("newInvitation.day")
            },
            {
                value: 7,
                label: "1 " + __("newInvitation.week")
            },
            {
                value: 30,
                label: "1 " + __("newInvitation.month")
            },
            {
                value: 183,
                label: "6 " + __("newInvitation.month")
            },
        ]
    },
});

Template.calendarSettings.events({
    //add your events here
    'click [selectDefaultView]': function (event, instance) {
        event.preventDefault()
        let view = event.currentTarget.id.split('#')[1]
        instance.data.project.callMethod("editCalendarDefaultView",
            projectController.getAuthInfo(instance.data.project._id),
            view,
            (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    Materialize.toast(__('calendarSettings.defaultViewSaved'), 6000, 'toastOk')
                }
            })
    },
    'click [deleteOldActivities]': function (event, instance) {
        event.preventDefault()
        let duration = Number($("#duration").val())
        let ActivityInstance = new Activity()
        let projectId = FlowRouter.current().params.projectId
        if (duration) {
            let date = new Date()
            date.setDate(date.getDate() - duration)
            ActivityInstance.callMethod("deleteOldsActivities", projectController.getAuthInfo(projectId), projectId, date, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    Materialize.toast(__('calendarSettings.oldsActivitiesDeleted'), 6000, 'toastOk')
                }
            })
        }

    },
    'click [importICSBtn]': function (e) {
        e.preventDefault()
        $('#importICS').click()
    },
    'change [importICSInput]': function (e, instance) {
        let file = e.currentTarget.files[0]
        var reader = new FileReader();
        reader.onload = function (event) {
            let str = event.target.result
            let parsedCalendar = ical.parseICS(str)

            let  setDateFromStr = (dateStr)=>{
                let res = moment()
                .year(dateStr.substr(0,4))
                .month(dateStr.substr(4,2)-1)
                .date(dateStr.substr(6,2))
                .hour(23).minute(0).second(0).millisecond(0)
                return res.toDate()
            }
            
            let countImportedEvents=0
            Object.keys(parsedCalendar).forEach((key, i) => {
                let parsedEvent = parsedCalendar[key]
                if(parsedEvent['type']=='VEVENT' | parsedEvent['type']=='VTODO'){
                    countImportedEvents++

                    let unencryptedActivityParams = {
                        symEnc_title:parsedEvent.summary ,
                        symEnc_detail: parsedEvent.description,
                    }

                    if(parsedEvent.rrule && parsedEvent.rrule.options && parsedEvent.rrule.options.byweekday && parsedEvent.rrule.options.byweekday.length){
                        unencryptedActivityParams.daysOfWeek = []
                        parsedEvent.rrule.options.byweekday.forEach(d=>{
                            unencryptedActivityParams.daysOfWeek.push(d+1>6 ? 0 : d+1)
                        })
                    }

                    if(parsedEvent.start.length === 8){
                        unencryptedActivityParams.allDay = true
                        unencryptedActivityParams.start = setDateFromStr(parsedEvent.start)
                        unencryptedActivityParams.end = setDateFromStr(parsedEvent.end)
                    }else{
                        unencryptedActivityParams.start = parsedEvent.start
                        unencryptedActivityParams.end = parsedEvent.end
                    }
                    cryptoTools.encryptObject(unencryptedActivityParams, {symKey: Session.get("currentProjectSimKey")}, (encryptedActivityParams) => {
                    let newActivity =new Activity()
                        let projectId = FlowRouter.current().params.projectId
                        newActivity.callMethod("newCalendarActivity", projectController.getAuthInfo(projectId), projectId, encryptedActivityParams,{}, (err, res) => {
                            if (err) {
                                console.log(err)
                            } else {
                                if(i==Object.keys(parsedCalendar).length-1){
                                    Materialize.toast(countImportedEvents+" "+__('calendarSettings.importSuccess'), 6000, 'toastOk')
                                }
                            }
                        })
                    })
                } 
                else{
                    Materialize.toast(__('calendarSettings.importError'),6000, 'toastError')
                }
            })
        };
        reader.readAsText(file);
    },
    'click [exportICS]': function (e, instance) {
        e.preventDefault()
        let eventToExports = []
        let activities = Activity.find({
            projectId: FlowRouter.current().params.projectId,
            start: {$exists: true}
        }).fetch()
        let getDateArray = (date) => {
            return [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()]
        }
        let getRecurency = (req) => {

            let res = {freq: "WEEKLY", count: 55, byday: []}
            req.forEach((dayIndex) => {
                res.byday.push(instance.days[dayIndex])
            })
            return res
        }
        cryptoTools.decryptArrayOfObject(activities, {symKey: Session.get("currentProjectSimKey")}, decryptedActivities => {
            var cal = ics();
            decryptedActivities.forEach((activity, i) => {
                cal.addEvent(
                    activity.symEnc_title,
                    activity.symEnc_detail,

                    null,
                    activity.start,
                    activity.end,
                    activity.daysOfWeek.length ? getRecurency(activity.daysOfWeek) : null
                )
                if (i === activities.length - 1) {
                    let filename = Project.findOne(FlowRouter.current().params.projectId).name + "-calendar-" + new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
                    cal.download(filename);

                }
            })
        })
    }
})
;

Template.calendarSettings.onCreated(function () {
    //add your statement here
    this.days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
});

Template.calendarSettings.onRendered(function () {
    //add your statement here
    resetTooltips()
    $('#duration').material_select();
});

Template.calendarSettings.onDestroyed(function () {
    //add your statement here
    $('#duration').material_select('destroy');
});

