-- Add 'Extras' add-ons to all chicken menu items
DO $$
DECLARE
    -- Item Names to apply extras to
    target_items text[] := ARRAY[
        'Chicken Wings (5 pcs)',
        'Chicken Wings (10 pcs)',
        'Chicken Wings Party Tray',
        'Chicken Poppers (1 Tub)',
        'Chicken Poppers Party Tray',
        'Chicken Tenders (2 pcs)',
        'Chicken Tenders (4 pcs)'
    ];
    
    item_id uuid;
    item_name text;
BEGIN
    FOREACH item_name IN ARRAY target_items
    LOOP
        -- Get the item ID
        SELECT id INTO item_id FROM menu_items WHERE name = item_name;
        
        IF item_id IS NOT NULL THEN
            -- Garlic Mayo (2oz): 35
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, 'Garlic Mayo (2oz)', 35, 'Extras');

            -- Honey: 45
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, 'Honey', 45, 'Extras');

            -- Large Dip: 75
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, 'Large Dip', 75, 'Extras');

            -- Cheese: 45
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, 'Cheese', 45, 'Extras');

            -- Cheese on top: 40
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, 'Cheese on top', 40, 'Extras');
        END IF;
    END LOOP;
END $$;
