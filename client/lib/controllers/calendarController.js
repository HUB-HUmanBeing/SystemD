import {Calendar} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interaction from '@fullcalendar/interaction';
import dayGrid from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';

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
        console.log(width)
        let number = parseInt(width / 120)

        return number > 7 ? 7 : number

    },
    columnNumber: 7,
    currentProject: {},
    initialize(project, instance) {
        this.currentProject = project
        this.columnNumber = this.calculateColumnNumber()
        this.calendar = new Calendar(document.getElementById('calendar'), {
            plugins: [dayGridPlugin, timeGridPlugin, interaction, dayGrid, listPlugin],
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
                    scrollTime: '08:00:00'
                },
                month: {
                    type: 'dayGridMonth'
                },
                list: {
                    type: 'listMonth'
                }
            },
            locale: this.getLocale(),
            height: "parent",
            editable: true,
            navLinks: true, // can click day/week names to navigate views
            eventLimit: true,
            dateClick: function (info) {
                console.log('clicked ', info);
            },
            select: function (info) {
                console.log('selected ', info);
            },
            events: 'https://fullcalendar.io/demo-events.json'
        });

        this.calendar.render();
        Meteor.setTimeout(() => {
            this.initializeRouterView(instance,project)
        }, 100)
    },

    initializeRouterView(instance, project) {
        instance.autorun(() => {
            FlowRouter.watchPathChange()
            let view = FlowRouter.current().queryParams.view

            this.calendar.changeView(view ? view : project.private.calendar.defaultView)

            Meteor.setTimeout(() => {
                instance.title.set(this.calendar.view.title)
            }, 100)

        })
    },
    changeView(viewName) {
        let currentQueryParams = FlowRouter.current().queryParams
        currentQueryParams.view = viewName
        FlowRouter.go('/project/' + this.currentProject._id + '/calendar', {}, currentQueryParams)

    },
    changePeriod(isPrevious) {
        $('.fc-' + (isPrevious ? 'prev' : 'next') + '-button').click()
        let currentQueryParams = FlowRouter.current().queryParams
        currentQueryParams.time = Number(currentQueryParams.time?currentQueryParams.time:"0") + (isPrevious ? -1 : 1)
        FlowRouter.go('/project/' + this.currentProject._id + '/calendar', {}, currentQueryParams)

    }
}
export default calendarController
