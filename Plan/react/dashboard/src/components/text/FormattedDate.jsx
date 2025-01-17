import React from 'react';
import {usePreferences} from "../../hooks/preferencesHook";
import {SimpleDateFormat} from "../../util/format/SimpleDateFormat";
import {useMetadata} from "../../hooks/metadataHook";
import {useTranslation} from "react-i18next";
import {isNumber} from "../../util/isNumber.js";

export const useDatePreferences = () => {
    const {timeZoneOffsetHours} = useMetadata();
    const {preferencesLoaded, dateFormatNoSeconds, recentDaysInDateFormat} = usePreferences();

    if (!preferencesLoaded) return {};

    const pattern = dateFormatNoSeconds;
    const recentDays = recentDaysInDateFormat;
    const recentDaysPattern = 'MMM d YYYY';

    const offset = timeZoneOffsetHours * 60 * 60 * 1000;

    return {pattern, recentDays, recentDaysPattern, offset};
}

export function formatDate(date, offset, pattern, recentDays, recentDaysPattern, t) {
    const dayMs = 24 * 60 * 60 * 1000;
    const timestamp = date - offset;
    const now = Date.now();
    const fromStartOfToday = (now - offset) % dayMs;

    let format = pattern;
    if (recentDays) {
        if (timestamp > now - fromStartOfToday) {
            format = format.replace(recentDaysPattern, t('plugin.generic.today'));
        } else if (timestamp > now - dayMs - fromStartOfToday) {
            format = format.replace(recentDaysPattern, t('plugin.generic.yesterday'));
        } else if (timestamp > now - dayMs * 5) {
            format = format.replace(recentDaysPattern, "EEEE");
        }
    }

    return date !== 0 ? new SimpleDateFormat(format).format(timestamp) : '-'
}

const FormattedDate = ({date}) => {
    const {t} = useTranslation();

    const {pattern, recentDays, recentDaysPattern, offset} = useDatePreferences();

    if (!pattern || date === undefined || date === null) return <></>;
    if (!isNumber(date)) return date;

    return formatDate(date, offset, pattern, recentDays, recentDaysPattern, t);
};

export default FormattedDate