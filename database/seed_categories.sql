-- Default categories for new users
-- Run this SQL in Supabase SQL Editor or use this as reference for initial categories

-- Common expense categories with colors and sort order
-- Note: These are template categories. In practice, they should be created per user.

-- Example template categories (replace USER_ID with actual user UUID):

/*
INSERT INTO public.categories (user_id, name, color, sort_order, hidden) VALUES
-- Primary categories
('USER_ID', '食費', '#FF6B6B', 1, false),
('USER_ID', '外食', '#FF8E92', 2, false),
('USER_ID', '交通費', '#4ECDC4', 3, false),
('USER_ID', '住居費', '#45B7D1', 4, false),
('USER_ID', '水道光熱費', '#74B9FF', 5, false),
('USER_ID', '通信費', '#0984E3', 6, false),
('USER_ID', '医療費', '#FD79A8', 7, false),
('USER_ID', '日用品', '#FDCB6E', 8, false),
('USER_ID', '衣服・美容', '#6C5CE7', 9, false),
('USER_ID', '娯楽・趣味', '#A29BFE', 10, false),
('USER_ID', '教育・書籍', '#00B894', 11, false),
('USER_ID', '旅行・レジャー', '#00CEC9', 12, false),
('USER_ID', '保険', '#2D3436', 13, false),
('USER_ID', '税金', '#636E72', 14, false),
('USER_ID', 'その他', '#95A5A6', 15, false);
*/

-- Function to create default categories for a new user
CREATE OR REPLACE FUNCTION create_default_categories(user_uuid UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, color, sort_order, hidden) VALUES
    -- 食事関連
    (user_uuid, '食費', '#FF6B6B', 1, false),
    (user_uuid, '外食', '#FF8E92', 2, false),
    
    -- 住居関連
    (user_uuid, '住居費', '#45B7D1', 3, false),
    (user_uuid, '水道光熱費', '#74B9FF', 4, false),
    (user_uuid, '通信費', '#0984E3', 5, false),
    
    -- 交通・移動
    (user_uuid, '交通費', '#4ECDC4', 6, false),
    
    -- 生活必需品
    (user_uuid, '日用品', '#FDCB6E', 7, false),
    (user_uuid, '衣服・美容', '#6C5CE7', 8, false),
    
    -- 健康・医療
    (user_uuid, '医療費', '#FD79A8', 9, false),
    
    -- 娯楽・趣味
    (user_uuid, '娯楽・趣味', '#A29BFE', 10, false),
    (user_uuid, '旅行・レジャー', '#00CEC9', 11, false),
    
    -- 自己投資
    (user_uuid, '教育・書籍', '#00B894', 12, false),
    
    -- 固定費
    (user_uuid, '保険', '#2D3436', 13, false),
    (user_uuid, '税金', '#636E72', 14, false),
    
    -- その他
    (user_uuid, 'その他', '#95A5A6', 15, false);
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT create_default_categories('your-user-uuid-here');

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_default_categories(UUID) TO authenticated;