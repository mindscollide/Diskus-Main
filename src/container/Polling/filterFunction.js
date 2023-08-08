import { useState } from 'react';
import { t } from 'your-i18n-library'; // Replace 'your-i18n-library' with the actual i18n library you are using

const StatusFilter = ({ setSelectedKeys, confirm, clearFilters }) => {
  const [selectedStatus, setSelectedStatus] = useState(''); // State to hold the selected filter value

  const handleChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSearch = () => {
    confirm();
    setSelectedKeys(selectedStatus ? [selectedStatus] : []);
  };

  const handleReset = () => {
    clearFilters();
    setSelectedKeys([]);
    setSelectedStatus('');
  };

  return (
    <div style={{ padding: 8 }}>
      <input
        placeholder={t('Search status')}
        value={selectedStatus}
        onChange={handleChange}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <button type="button" onClick={handleSearch} style={{ width: 90, marginRight: 8 }}>
        {t('Search')}
      </button>
      <button type="button" onClick={handleReset} style={{ width: 90 }}>
        {t('Reset')}
      </button>
    </div>
  );
};

export default StatusFilter;