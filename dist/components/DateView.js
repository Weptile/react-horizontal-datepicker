/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styles from './DatePicker.module.css';
import { addDays, addMonths, differenceInMonths, format, isSameDay, lastDayOfMonth, startOfMonth } from 'date-fns';

const DateView = ({
  startDate,
  lastDate,
  selectDate,
  getSelectedDay,
  primaryColor,
  labelFormat,
  getDayClass,
  disableSelectDay,
  containerRef,
}) => {

  const [selectedDate, setSelectedDate] = useState(null);

  const selectedStyle = {
    fontWeight: 'bold',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    border: `2px solid ${primaryColor}`,
    color: primaryColor,
  };
  const labelColor = {
    color: primaryColor,
  };

  const getStyles = day => {
    return isSameDay(day, selectedDate) ? selectedStyle : null;
  };

  const getId = day => {
    return isSameDay(day, selectedDate) ? 'selected' : '';
  };

  const renderDays = () => {
    const dayFormat = 'E';
    const dateFormat = 'd';

    let days = {};

    let currentDay = startDate;

    while (currentDay <= lastDate) {
      const monthKey = format(currentDay, labelFormat || 'MMMM yyyy');

      if (!days[monthKey])
        days[monthKey] = [];

      days[monthKey].push( /*#__PURE__*/React.createElement('div', {
        id: `${getId(currentDay)}`,
        className: `${styles.dateDayItem} ${getDayClass ? getDayClass(currentDay) : ''}`,
        style: getStyles(currentDay),
        key: currentDay,
        onClick: () => onDateClick(currentDay),
      }, /*#__PURE__*/React.createElement('div', {
        className: styles.dayLabel + ' dayLabel',
      }, format(currentDay, dayFormat)), /*#__PURE__*/React.createElement('div', {
        className: styles.dateLabel + ' dateLabel',
      }, format(currentDay, dateFormat))));

      currentDay = addDays(currentDay , 1);

    }

    const months = Object.keys(days).map((monthKey,index)=>{
      return  /*#__PURE__*/React.createElement('div', {
        className: styles.monthContainer,
        key: monthKey,
      }, /*#__PURE__*/React.createElement('span', {
        className: styles.monthYearLabel,
        style: labelColor,
      }, monthKey), /*#__PURE__*/React.createElement('div', {
        className: styles.daysContainer,
      }, days[monthKey]))
    })

    return /*#__PURE__*/React.createElement('div', {
      ref: containerRef,
      className: styles.dateListScrollable,
    }, months);
  };

  const onDateClick = day => {

    if (disableSelectDay) return;
    setSelectedDate(day);

    if (getSelectedDay) {
      getSelectedDay(day);
    }
  };

  useEffect(() => {
    if (getSelectedDay) {
      if (selectDate) {
        getSelectedDay(selectDate);
      } else {
        getSelectedDay(startDate);
      }
    }
  }, []);
  useEffect(() => {
    if (selectDate) {
      if (!isSameDay(selectedDate, selectDate)) {
        setSelectedDate(selectDate);
        setTimeout(() => {
          let view = document.getElementById('selected');

          if (view) {
            view.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
              block: 'nearest',
            });
          }
        }, 20);
      }
    }
  }, [selectDate]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderDays());
};

export { DateView };