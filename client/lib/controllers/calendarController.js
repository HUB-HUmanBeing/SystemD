import {Calendar} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import list from '@fullcalendar/list';
import interaction from '@fullcalendar/interaction';
import dayGrid from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import Activity from "../../../imports/classes/Activity";
import projectController from "./projectController";
import cryptoTools from "../cryptoTools";
import mapParams from "./mapParams";

const calendarController = {
    calendar: false,
    getLocale() {
        switch (i18n.getLocale()) {
            case 'fr-FR':
                return frLocale
                break
            default:
                return null;
        }
    },
    calculateColumnNumber() {
        let width = document.getElementById('calendar').offsetWidth
        let number = parseInt(width / 120)
        return number > 7 ? 7 : number
    },
    columnNumber: 7,
    currentProject: {},
    initialize(project, instance) {
        this.currentProject = project
        this.columnNumber = this.calculateColumnNumber()
        this.calendar = new Calendar(document.getElementById('calendar'), {
            plugins: [dayGridPlugin, timeGridPlugin, interaction, dayGrid, list],
            defaultView: project.private.calendar.defaultView,
            header: {
                left: 'prev,next',
                center: 'title',
                right: ''
            },
            views: {
                days: {
                    type: 'timeGridWeek',
                    duration: {days: this.columnNumber},
                    buttonText: '3 days',
                    scrollTime: '08:30:00'
                },
                month: {
                    type: 'dayGridMonth'
                },
                listMonth: {
                    type: 'listMonth'
                }
            },
            longPressDelay: 500,
            //selectLongPressDelay:500,
            locale: this.getLocale(),
            height: "parent",
            editable: true,
            selectable: true,
            eventResizableFromStart: true,
            navLinks: true,
            nowIndicator: true,
            navLinkDayClick: (date, jsEvent) => {
                this.changeView("days", date)
            },
            // eventRender: function(info) {
            //     console.log(info)
            //     if(Meteor.Device.isDesktop()){
            //         let html = `<div>coucou</div>`
            //         $(info.el).tooltip({
            //             delay:350,
            //             position:"top",
            //             tooltip: html,
            //             html:true
            //         })
            //     }
            // },
            eventLimit: true,
            select: (info) => {
                let activity = new Activity()
                let activityParams = {
                    start: info.start,
                    end: info.end,
                    allDay: info.allDay
                }
                //instance.createParams.set(activityParams)
                activity.callMethod("newCalendarActivity", projectController.getAuthInfo(project._id), project._id, activityParams, {}, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        this.calendar.unselect()
                        this.getEventDetail(res)
                    }
                })
            },
            eventClick: (info) => {
                this.getEventDetail(info.event.id)
            },
            eventResize: (info) => {
                this.editEvent(info, project)
            },
            eventDrop: (info) => {
                this.editEvent(info, project)
            },

        });

        this.calendar.render();
        Meteor.setTimeout(() => {
            this.initializeRouterView(instance, project)
            this.initializeEventRenderer(instance, project)
        }, 50)
    },
    initializeEventRenderer(instance, project) {
        Meteor.subscribe("activitiesByProject", projectController.getAuthInfo(project._id), project._id, err => {
            instance.autorun(() => {
                let start = new Date().getTime()
                let eventSource = {
                    id: "currentProjectEvents",
                    events: []
                }
                FlowRouter.watchPathChange()
                let activities = Activity.find({projectId: project._id, start: {$exists: true}}).fetch()
                cryptoTools.decryptArrayOfObject(activities, {symKey: Session.get("currentProjectSimKey")}, decryptedActivities => {
                    Meteor.setTimeout(() => {
                        decryptedActivities.forEach(activity => {
                            eventSource.events.push(this.getEventFromActivity(activity, FlowRouter.current().queryParams.activityId))
                        })
                        let currentEventSource = this.calendar.getEventSourceById("currentProjectEvents")
                        if (currentEventSource) {
                            currentEventSource.remove()
                        }
                        this.calendar.addEventSource(eventSource)
                    }, 0)
                })

            })
        })

    },
    editEvent(info, project) {
        let activity = Activity.findOne(info.event.id)
        let activityParams = {
            start: info.event.start,
            end: info.event.end,
            allDay: info.event.allDay
        }
        if (!activityParams.end) {
            let start = activityParams.start
            start.setHours(start.getHours() + 1)
            activityParams.end = start
        }
        activity.callMethod("editCalendarActivityTime", projectController.getAuthInfo(project._id), activityParams, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                this.getEventDetail(info.event.id)
            }
        })
    },
    getEventFromActivity(activity, focusedActivity) {

        let event

        let participating = ""
        if (activity.participants.length) {
            participating = activity.participants.indexOf(projectController.getCurrentMemberId(activity.projectId)) === -1 ? "" : "participating"
        }
        if (activity.invitedMembers.length && !Session.get("invitationActivityId")) {
            if (activity.invitedMembers.indexOf(projectController.getCurrentMemberId(activity.projectId)) > -1) {
                Session.set("invitationActivityId", activity)
            }
        }
        if (activity.daysOfWeek.length) {
            let startTime = activity.allDay ? null : activity.start.getHours() + ":" + activity.start.getMinutes()
            let endTime = activity.allDay ? null : activity.end.getHours() + ":" + activity.end.getMinutes()
            event = {
                id: activity._id,
                title: (activity.symEnc_title ? activity.symEnc_title + " " : "") + __("projectCalendar.recurring"),
                allDay: activity.allDay,
                classNames: ["event-color-" + activity.color, participating],
                daysOfWeek: activity.daysOfWeek,
                startTime: startTime,
                endTime: endTime,
            }
        } else {
            event = {
                id: activity._id,
                title: activity.symEnc_title ? activity.symEnc_title : __("projectCalendar.unnamed"),
                start: activity.start,
                end: activity.end,
                allDay: activity.allDay,
                classNames: ["event-color-" + activity.color, participating]
            }
        }
        if (activity.checkList.length) {
            let validItems = 0
            activity.checkList.forEach(check => {
                if (check.checked) {
                    validItems++
                }
            })
            event.title = event.title + " \t\t\ ☑️" + validItems + "/" + activity.checkList.length
        }
        if (focusedActivity && activity._id == focusedActivity) {
            event.classNames.push(' focusedActivity')
        }

        return event
    },
    initializeRouterView(instance, project) {
        instance.autorun(() => {
            FlowRouter.watchPathChange()
            let view = FlowRouter.current().queryParams.view
            let date = FlowRouter.current().queryParams.date
            this.calendar.changeView(view ? view : project.private.calendar.defaultView, date)

            Meteor.setTimeout(() => {
                instance.title.set(this.calendar.view.title)
            }, 100)

        })
    },
    changeView(viewName, date) {
        let currentQueryParams = FlowRouter.current().queryParams
        currentQueryParams.view = viewName
        if (date) {
            currentQueryParams.date = date
        } else {
            delete currentQueryParams.date
        }
        FlowRouter.go('/project/' + this.currentProject._id + '/calendar', {}, currentQueryParams)

    },
    getEventDetail(eventId) {
        let currentQueryParams = FlowRouter.current().queryParams

        currentQueryParams.side = "activityDetail"
        currentQueryParams.activityId = eventId
        FlowRouter.go('/project/' + this.currentProject._id + '/calendar', {}, currentQueryParams)
    },
    goSettings(eventId) {
        let currentQueryParams = FlowRouter.current().queryParams

        currentQueryParams.side = "calendarSettings"
        delete currentQueryParams.activityId
        FlowRouter.go('/project/' + this.currentProject._id + '/calendar', {}, currentQueryParams)
    },
    closeSideNav() {
        let currentQueryParams = FlowRouter.current().queryParams

        delete currentQueryParams.side
        delete currentQueryParams.activityId
        FlowRouter.go('/project/' + this.currentProject._id + '/calendar', {}, currentQueryParams)

    },
    changePeriod(isPrevious) {
        $('.fc-' + (isPrevious ? 'prev' : 'next') + '-button').click()
        let currentQueryParams = FlowRouter.current().queryParams
        delete currentQueryParams.date
        currentQueryParams.time = Number(currentQueryParams.time ? currentQueryParams.time : "0") + (isPrevious ? -1 : 1)
        FlowRouter.go('/project/' + this.currentProject._id + '/calendar', {}, currentQueryParams)

    }
}
export default calendarController
