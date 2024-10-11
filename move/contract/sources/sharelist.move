module aptos_share::sharelist {

    use std::signer;
    use std::string::String;
    use aptos_std::table::{Self, Table};
    // use aptos_framework::aptos_coin::{Self, AptosCoin};
    #[test_only]
    use std::string;
    #[test_only]
    use aptos_framework::account;

    // Errors
    const E_NOT_INITIALIZED: u64 = 1;
    const ETASK_DOESNT_EXIST: u64 = 2;
    const ETASK_IS_COMPLETED: u64 = 3;

    struct FileStore has key {
        files: Table<u64, FileInfo>,
        file_counter: u64,
        owner: address,
    }

    #[event]
    struct FileInfo has store, drop, copy {
        file_id: u64,
        filename: String,
        media: String,
        hash: String,
        // password 1
        salt: String,
        // password 2
        blobId: String,
        // walrus blobId
        share: u64,
        // share type 0-free 1-code 2-sui
        fee: u64,
        code: String,
        owner: address,
    }

    public entry fun create_store(manager: &signer) {
        let signer_address = signer::address_of(manager);

        let fileStore = FileStore {
            files: table::new(),
            file_counter: 0,
            owner: signer_address,
        };

        // move the resource under the signer account
        move_to(manager, fileStore);
    }


    public entry fun add_file(
        account: &signer,
        // store_address: address,
        filename: String,
        media: String,
        hash: String, // password 1
        salt: String, // password 2
        blobId: String, // walrus blobId
        share: u64, // share type 0-free 1-code 2-sui
        fee: u64,
        code: String,
    ) acquires FileStore {
        // gets the signer address
        let signer_address = signer::address_of(account);
        // assert signer has created a list
        assert!(exists<FileStore>(signer_address), E_NOT_INITIALIZED);
        // gets the resource
        let fileStore = borrow_global_mut<FileStore>(signer_address);
        // increment counter
        let counter = fileStore.file_counter + 1;

        // creates a new info
        let new_fileInfo = FileInfo {
            file_id: counter,
            owner: signer_address,
            filename,
            media,
            hash,
            salt,
            blobId,
            share, // 0-free 1-code 2-sui
            fee,
            code,
        };
        // adds the new task into the tasks table
        table::upsert(&mut fileStore.files, counter, new_fileInfo);
        // sets the task counter to be the incremented counter
        fileStore.file_counter = counter;

        // const coinTypeToTransfer = APTOS_COIN;
        // transfer<AptosCoin>()
    }


    #[test(admin = @0x123)]
    public entry fun test_flow(admin: signer) acquires FileStore {
        // creates an admin @todolist_addr account for test
        account::create_account_for_test(signer::address_of(&admin));
        // initialize contract with admin account
        create_store(&admin);

        add_file(
            &admin,
            string::utf8(b"filename"),
            string::utf8(b"media"),
            string::utf8(b"hash"),
            string::utf8(b"salt"),
            string::utf8(b"blobId"),
            0, // 0-free 1-code 2-sui
            1_000,
            string::utf8(b"code"),
        );

        add_file(
            &admin,
            string::utf8(b"filename"),
            string::utf8(b"media"),
            string::utf8(b"hash"),
            string::utf8(b"salt"),
            string::utf8(b"blobId"),
            0, // 0-free 1-code 2-sui
            1_000,
            string::utf8(b"code"),
        );

        let fileStore = borrow_global<FileStore>(signer::address_of(&admin));
        assert!(fileStore.file_counter == 2, 5);

        let fileInfo = table::borrow(&fileStore.files, 1);
        assert!(fileInfo.file_id == 1, 6);
    }
}