// components/SearchBar.js
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <Input
      placeholder="Search appointments"
      prefix={<SearchOutlined />}
      onChange={(e) => onSearch(e.target.value)}
      style={{ width: 600, marginBottom: 16 }}
    />
  );
};

export default SearchBar;

