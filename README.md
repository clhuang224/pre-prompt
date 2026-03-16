# PrePrompt

將文字貼進 LLM 前，用 PrePrompt 替換敏感資訊。

PrePrompt 是一個為個人工作流程設計的小工具，方便在把文章貼給 LLM 之前，先用自訂詞組替換掉敏感資料。

## 專案畫面

![demo](./demo.png)

## 使用說明

1. 在「原始文章」輸入框貼上文章。
2. 點選「新增」，輸入「原字詞」與「新字詞」。
3. 點選核取方塊啟用或停用替代規則，點選「刪除」可移除不需要的字詞。
4. 結果會依照替代規則，顯示在「結果」輸入框（唯讀）。

> 新字詞會統一加上 `_` 前後綴，以避免與原字詞混淆。

## 資料儲存

原始文章和替代詞組會儲存在瀏覽器的 LocalStorage 中，不會送到伺服器。  
你可以在瀏覽器的開發者工具中查看或清除這些資料。

## 未來方向

### 待整理

- 檢查並整理 vibe coding 產生的程式碼

### 功能擴充

- 支援正則表達式
- 大小寫判斷
- 斷詞問題
- 替換規則優先順序問題
- 輸入 / 輸出 JSON
- 美美的介面
- 自動偵測敏感資訊

## 前身

由這個 script 修改而來：

```bash
#!/bin/bash
# 用法：
# chmod +x replace_words.sh
# 用法： ./replace_words.sh word_map.txt target.txt

mapping_file="$1"
input_file="$2"

if [ -z "$mapping_file" ] || [ -z "$input_file" ]; then
  echo "用法： ./replace_words.sh word_map.txt target.txt"
  exit 1
fi

# 產生輸出檔名
filename=$(basename "$input_file")
extension="${filename##*.}"
basename_no_ext="${filename%.*}"
output_file="${basename_no_ext}_rename.${extension}"

# 複製一份新檔案
cp "$input_file" "$output_file"

# 逐行讀取對照表
# 格式範例：
# 小明 __
# 蘋果科技 __公司
while IFS=$' \t' read -r from to || [[ -n "$from" ]]; do
  # 跳過空行或註解行
  [[ -z "$from" || "$from" =~ ^# ]] && continue

  # 使用 | 分隔避免字元衝突，macOS sed 要用 -i ''
  sed -i '' "s|${from}|${to}|g" "$output_file"
done < "$mapping_file"

echo "✅ 已完成取代，輸出檔案：$output_file"
```

## License

MIT
