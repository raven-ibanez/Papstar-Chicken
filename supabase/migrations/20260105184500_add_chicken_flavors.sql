-- Remove previous variations since we are using add-ons for flavors now
DELETE FROM variations 
WHERE menu_item_id IN (
    SELECT id FROM menu_items WHERE name IN (
        'Chicken Wings (5 pcs)',
        'Chicken Wings (10 pcs)',
        'Chicken Wings Party Tray',
        'Chicken Poppers (1 Tub)',
        'Chicken Poppers Party Tray',
        'Chicken Tenders (2 pcs)',
        'Chicken Tenders (4 pcs)'
    )
);

-- Helper function to insert flavors for a specific item and category name
-- We use a DO block to execute procedural SQL for cleaner code
DO $$
DECLARE
    -- Item Names
    wings_5 text := 'Chicken Wings (5 pcs)';
    wings_10 text := 'Chicken Wings (10 pcs)';
    wings_party text := 'Chicken Wings Party Tray';
    poppers_1 text := 'Chicken Poppers (1 Tub)';
    poppers_party text := 'Chicken Poppers Party Tray';
    tenders_2 text := 'Chicken Tenders (2 pcs)';
    tenders_4 text := 'Chicken Tenders (4 pcs)';
    
    -- Flavor Lists
    basic_flavors text[] := ARRAY['Buttered', 'Teriyaki', 'Soy Garlic', 'Buffalo', 'Smoked BBQ'];
    premium_flavors text[] := ARRAY['C. Garlic Parmesan', 'Creamy Salted Egg', 'Seoul Spicy', 'Hot Honey Rub'];
    
    -- IDs
    item_id uuid;
    flavor text;
    
    -- Function to add flavors for an item
    -- category_label: e.g., 'Flavor 1', '2nd Flavor'
    -- base_surcharge: e.g., 0 for regular, 30 for 2nd flavor
    
BEGIN
    ---------------------------------------------------------------------------
    -- Standard Items (Wings 5/10, Poppers 1 Tub, Tenders 2/4)
    -- Slots: 'Flavor 1' (0 surcharge), '2nd Flavor' (30 surcharge)
    ---------------------------------------------------------------------------
    
    FOREACH item_id IN ARRAY ARRAY(
        SELECT id FROM menu_items WHERE name IN (wings_5, wings_10, poppers_1, tenders_2, tenders_4)
    )
    LOOP
        -- Flavor 1 (Base Surcharge 0)
        FOREACH flavor IN ARRAY basic_flavors LOOP
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, flavor, 0, 'Flavor 1');
        END LOOP;
        
        FOREACH flavor IN ARRAY premium_flavors LOOP
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, flavor, 20, 'Flavor 1');
        END LOOP;
        
        -- 2nd Flavor (Base Surcharge 30)
        FOREACH flavor IN ARRAY basic_flavors LOOP
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, flavor, 30, '2nd Flavor (Optional)'); -- 30 base
        END LOOP;
        
        FOREACH flavor IN ARRAY premium_flavors LOOP
            INSERT INTO add_ons (menu_item_id, name, price, category)
            VALUES (item_id, flavor, 30 + 20, '2nd Flavor (Optional)'); -- 30 base + 20 premium
        END LOOP;
    END LOOP;

    ---------------------------------------------------------------------------
    -- Party Trays (Wings Party, Poppers Party)
    -- Slots: 'Flavor 1', 'Flavor 2', 'Flavor 3', 'Flavor 4' (All 0 surcharge)
    ---------------------------------------------------------------------------
    
    FOREACH item_id IN ARRAY ARRAY(
        SELECT id FROM menu_items WHERE name IN (wings_party, poppers_party)
    )
    LOOP
        -- We need 4 flavor slots
        FOR i IN 1..4 LOOP
            DECLARE
                cat_name text := 'Flavor ' || i;
            BEGIN
                FOREACH flavor IN ARRAY basic_flavors LOOP
                    INSERT INTO add_ons (menu_item_id, name, price, category)
                    VALUES (item_id, flavor, 0, cat_name);
                END LOOP;
                
                FOREACH flavor IN ARRAY premium_flavors LOOP
                    INSERT INTO add_ons (menu_item_id, name, price, category)
                    VALUES (item_id, flavor, 20, cat_name);
                END LOOP;
            END;
        END LOOP;
    END LOOP;

END $$;
