import ping from './ping';
import assign from './assign';
import autosort from './autosort';
import talk from './talk';
import countdown from './countdown';
import timer from './timer';
import announce from './announce';
import type { Command } from '../types/command';

export const commands: Command[] = [ping, assign, autosort, talk, countdown, timer, announce];

export default commands;