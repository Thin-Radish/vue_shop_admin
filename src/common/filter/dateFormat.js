import formatDate from 'common/utils/formatDate'

/**
 * 时间戳过滤器
 * @param {number} originVal 时间戳
 */
export default function dateFormat(originVal) {
  const dt = new Date(originVal * 1000);
  return formatDate(dt, "yyyy-MM-dd hh:mm:ss");
}