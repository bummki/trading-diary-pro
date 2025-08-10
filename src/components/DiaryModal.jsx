import React, { useState, useEffect } from 'react';
import { X, Save, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';

const DiaryModal = ({ isOpen, onClose, onSaveDiary, diaryEntries = [] }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    title: '',
    category: '매매전략',
    content: '',
    keywords: ''
  });

  const [editingId, setEditingId] = useState(null);

  const categories = [
    '매매전략',
    '시장분석',
    '학습노트',
    '심리',
    '리스크관리',
    '기타'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('제목과 내용은 필수 입력 항목입니다.');
      return;
    }

    const diary = {
      id: editingId || Date.now().toString(),
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      createdAt: editingId ? diaryEntries.find(d => d.id === editingId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveDiary(diary, editingId);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      title: '',
      category: '매매전략',
      content: '',
      keywords: ''
    });
    setEditingId(null);
  };

  const handleEdit = (diary) => {
    setFormData({
      date: diary.date,
      title: diary.title,
      category: diary.category,
      content: diary.content,
      keywords: Array.isArray(diary.keywords) ? diary.keywords.join(', ') : diary.keywords || ''
    });
    setEditingId(diary.id);
  };

  const handleDelete = (id) => {
    if (confirm('정말로 이 일지를 삭제하시겠습니까?')) {
      onSaveDiary(null, id); // null을 전달하여 삭제 표시
    }
  };

  const exportToCSV = () => {
    if (diaryEntries.length === 0) {
      alert('내보낼 일지가 없습니다.');
      return;
    }

    const headers = ['날짜', '제목', '카테고리', '내용', '키워드', '생성일', '수정일'];
    const csvContent = [
      headers.join(','),
      ...diaryEntries.map(entry => [
        entry.date,
        `"${entry.title.replace(/"/g, '""')}"`,
        entry.category,
        `"${entry.content.replace(/"/g, '""')}"`,
        `"${Array.isArray(entry.keywords) ? entry.keywords.join(', ') : entry.keywords || ''}"`,
        entry.createdAt,
        entry.updatedAt
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trading_diary_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\\n');
        const headers = lines[0].split(',');
        
        if (headers.length < 7) {
          alert('올바른 CSV 형식이 아닙니다.');
          return;
        }

        const importedEntries = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',');
          if (values.length >= 7) {
            const entry = {
              id: Date.now().toString() + i,
              date: values[0],
              title: values[1].replace(/^"|"$/g, '').replace(/""/g, '"'),
              category: values[2],
              content: values[3].replace(/^"|"$/g, '').replace(/""/g, '"'),
              keywords: values[4].replace(/^"|"$/g, '').split(', ').filter(k => k),
              createdAt: values[5],
              updatedAt: values[6]
            };

            // 중복 체크 (제목+날짜 기준)
            const isDuplicate = diaryEntries.some(existing => 
              existing.title === entry.title && existing.date === entry.date
            );

            if (!isDuplicate) {
              importedEntries.push(entry);
            }
          }
        }

        if (importedEntries.length > 0) {
          importedEntries.forEach(entry => onSaveDiary(entry, null));
          alert(`${importedEntries.length}개의 일지를 가져왔습니다.`);
        } else {
          alert('가져올 새로운 일지가 없습니다.');
        }
      } catch (error) {
        alert('CSV 파일을 읽는 중 오류가 발생했습니다.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // 파일 입력 초기화
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">매매일지 작성</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  가져오기
                </span>
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                className="hidden"
              />
            </label>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 일지 작성 폼 */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {editingId ? '일지 수정' : '새 일지 작성'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">날짜</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">카테고리</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">제목</label>
                  <input
                    type="text"
                    placeholder="일지 제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">내용</label>
                  <textarea
                    placeholder="매매 경험, 학습 내용, 시장 분석 등을 자유롭게 작성하세요"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="w-full p-2 border rounded-lg h-40 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">키워드 (쉼표로 구분)</label>
                  <input
                    type="text"
                    placeholder="예: 비트코인, 지지선, 돌파, 손절"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="flex gap-3">
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                      취소
                    </Button>
                  )}
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? '수정' : '저장'}
                  </Button>
                </div>
              </form>
            </div>

            {/* 일지 목록 */}
            <div>
              <h3 className="text-lg font-medium mb-4">일지 목록 ({diaryEntries.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {diaryEntries.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>작성된 일지가 없습니다.</p>
                    <p className="text-sm">첫 번째 일지를 작성해보세요!</p>
                  </div>
                ) : (
                  diaryEntries
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{entry.title}</span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {entry.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {entry.content.length > 100 
                                ? entry.content.substring(0, 100) + '...' 
                                : entry.content
                              }
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{entry.date}</span>
                              {entry.keywords && entry.keywords.length > 0 && (
                                <span>
                                  {Array.isArray(entry.keywords) 
                                    ? entry.keywords.slice(0, 3).join(', ')
                                    : entry.keywords
                                  }
                                  {Array.isArray(entry.keywords) && entry.keywords.length > 3 && '...'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(entry)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              수정
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;

