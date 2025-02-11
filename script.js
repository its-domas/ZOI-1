
document.addEventListener("DOMContentLoaded", function () {
    const apiKey = '8Fs3phbiI63XIG4WO2lBe83X8STE2ioC42BldAsS';
    const urlpoolprice =
        'https://public-api.dextools.io/trial/v2/pool/arbitrum/0x874cda82c3e797d3bdab4057560af1f756cc24a4/price';
    const urltokeninfo =
        'https://public-api.dextools.io/trial/v2/token/arbitrum/0x3b55804e532c4d7c47894d5ed89a89a5ff103fe2/info';
    const urltokenprice =
        'https://public-api.dextools.io/trial/v2/token/arbitrum/0x3b55804e532c4d7c47894d5ed89a89a5ff103fe2/price';

    // Fetch pool data (volume24h)
    async function fetchPoolData() {
        try {
            const response = await fetch(urlpoolprice, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey,
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("Full pool API response:", data);
            let volume24h = data?.data?.volume24h;
            if (volume24h == null) volume24h = 0;
            document.getElementById("volume24h").innerText = `$${volume24h.toFixed(0)}`;
        } catch (error) {
            console.error("Fetch error:", error);
            document.getElementById("volume24h").innerText = "Failed to load data";
        }
    }

    // Fetch token price and return it
    async function fetchTokenDataPrice() {
        try {
            const response = await fetch(urltokenprice, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey,
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("Full token price API response:", data);
            let price = data?.data?.price;
            if (price == null) price = 0;
            document.getElementById("price").innerText = `$${price.toFixed(5)}`;
            return price;
        } catch (error) {
            console.error("Fetch error:", error);
            document.getElementById("price").innerText = "Failed to load data";
            return 0;
        }
    }

    // Compute mcap from totalSupply (from token info) and price (from token price)
    async function fetchTokenMcap(price) {
        try {
            const response = await fetch(urltokeninfo, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            console.log("Full token info API response:", data);
            let totalSupply = data?.data?.totalSupply;
            if (totalSupply == null) totalSupply = 0;
            // Compute market cap as totalSupply * price
            let computedMcap = Number(totalSupply) * Number(price);
            console.log("Computed Market Cap:", computedMcap);
            document.getElementById("mcap").innerText = `$${computedMcap.toFixed(0)}`;
        } catch (error) {
            console.error("Fetch error:", error);
            document.getElementById("mcap").innerText = "Failed to load data";
        }
    }

    // Fetch token change (variation24h)
    async function fetchTokenChange() {
        try {
            const response = await fetch(urltokenprice, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "x-api-key": apiKey,
                },
            });
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            console.log("Full token change API response:", data);
            let variation24h = data?.data?.variation24h;
            if (variation24h == null) variation24h = 0;
            document.getElementById("variation24h").innerText = `${variation24h.toFixed(2)}%`;
        } catch (error) {
            console.error("Fetch error:", error);
            document.getElementById("variation24h").innerText = "Failed to load data";
        }
    }

    // Start fetching data
    fetchPoolData();
    // First, fetch the token price. Then use that price to compute market cap.
    fetchTokenDataPrice().then((price) => {
        fetchTokenMcap(price);
    });
    fetchTokenChange();
});
