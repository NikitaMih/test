import {
    dateToState,
    stateToDate
} from './DateConvert';

describe('DateConvert tests', () => {
    it('dateToState works correct', () => {
        const dateStr = '29.05.2022';
        expect(dateToState(dateStr)).toBe('2022-05-29');
    });

    it('dateToState with empty string', () => {
        const dateStr = '';
        expect(dateToState(dateStr)).toBeNull();
    });

    it('stateToDate works correct', () => {
        const dateStr = '2022-05-29';
        expect(stateToDate(dateStr)).toBe('29.05.2022');
    });

    it('stateToDate with empty string', () => {
        const dateStr = '';
        expect(stateToDate(dateStr)).toBeNull();
    });
});
