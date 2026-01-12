const searchForm = document.querySelector('#search'); // 폼 선택
const searchInput = document.querySelector('#search input');
const searchResults = document.querySelector('#search-results');

let fuse;

fetch('/index.json')
  .then(response => response.json())
  .then(data => {
    const options = {
      keys: ['title', 'tags', 'contents'],
      includeScore: true,
      threshold: 0.3
    };
    fuse = new Fuse(data, options);
  });

// 검색 실행 핵심 함수
const executeSearch = (query) => {
//  if (query.length < 2) {
//    searchResults.innerHTML = '';
//    return;
//  }

  if (!fuse) return; // 데이터 로드 전 방어 코드

  const results = fuse.search(query);
  let html = '';

  if (results.length === 0) {
    html = '<p class="p-4 text-zinc-500">No results found.</p>';
  } else {
    results.forEach(result => {
      html += `
        <div class="p-4 border-b border-zinc-200">
          <a href="${result.item.permalink}" class="text-lg font-semibold text-zinc-800 hover:text-blue-600">${result.item.title}</a>
          <p class="text-sm text-zinc-500 line-clamp-2">${result.item.contents.substring(0, 100)}...</p>
        </div>
      `;
    });
  }
  searchResults.innerHTML = html;
};

// 1. 실시간 검색 (입력할 때마다)
searchInput.addEventListener('input', () => {
  executeSearch(searchInput.value);
});

const execute = (query) => {
  if (!fuse) return; // 데이터 로드 전 방어 코드
  const results = fuse.search(query);

  if (results.length > 0) {
    window.location.href = results[0].item.permalink;
  }
};

// 2. 버튼 클릭 및 엔터 키 처리 (Form Submit)
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    execute(searchInput.value);
});