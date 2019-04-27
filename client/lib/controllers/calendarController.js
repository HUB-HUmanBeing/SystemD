import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interaction from '@fullcalendar/interaction';
import dayGrid from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
const calendarController = {
    calendar : false,
    getLocale(){
        switch (i18n.getLocale()) {
            case 'fr-FR':
                return frLocale
            break
            default:
                return null;
        }
    },
    initialize(project, instance) {

        this.calendar = new Calendar(document.getElementById('calendar'), {
            plugins: [ dayGridPlugin,timeGridPlugin, interaction, dayGrid, listPlugin ],
            defaultView: 'dayGridWeek',
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek,'
            },
            locale: this.getLocale(),
            height:"parent",
            editable: true,
            navLinks: true, // can click day/week names to navigate views
            eventLimit: true,
            dateClick: function(info) {
                console.log('clicked ', info);
            },
            select: function(info) {
                console.log('selected ',info);
            },
            events: 'https://fullcalendar.io/demo-events.json'
        });

        this.calendar.render();
    }
}
export default calendarController
