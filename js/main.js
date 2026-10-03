import './navigation.js';
import './renderers.js';
import { initializeMotionPreference } from './motion.js';

// Module scripts run after HTML parsing; no DOMContentLoaded wrapper is needed.
initializeMotionPreference();
