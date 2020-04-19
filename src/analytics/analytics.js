/* eslint-disable no-undef */

const GOOGLE_ID = 'UA-163356772-1';
export const CATEGORIES = {
  ROOM: 'room',
  USER: 'user',
  HOST_CONTROLS: 'hostcontrols',
  CONVO: 'conversation',
  LINKS: 'links',
  MESSAGES: 'messages'
}

const analytics = {
  pageView: async (page_path, page_title) => {
    gtag('config', GOOGLE_ID, { page_path, page_title });
  },
  event: async (action, event_category, event_label) => {
    gtag('event', action, { event_category, event_label });
  },
  nonInteractionEvent: async (action, event_category, event_label) => {
    gtag('event', action, { event_category, event_label, non_interaction: true });
  }
};

export default analytics;