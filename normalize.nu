def normalize [] {
    update properties {
        $in
        | group-by block --to-table
        | each {
            let items = get items
            $items | each {
                $in
                | insert count { $items | length }
                | upsert rent { default [4, 10] }
                | insert kind { get -i special | default "lot" }
                | reject -i special
            }
        }
        | flatten | sort-by id
    }
}

