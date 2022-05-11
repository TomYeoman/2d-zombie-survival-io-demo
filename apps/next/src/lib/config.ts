const getEnvironmentVariable = (environmentVariable: string): string => {
    const unvalidatedEnvironmentVariable = process.env[environmentVariable];
    if (!unvalidatedEnvironmentVariable) {
      throw new Error(
        `Couldn't find environment variable: ${environmentVariable}`
      );
    } else {
      return unvalidatedEnvironmentVariable;
    }
  };
  
  export const config = {
    moralisAppID: getEnvironmentVariable("NEXT_PUBLIC_MORALIS_APPLICATION_ID"),
    moralisServerUrl: getEnvironmentVariable("NEXT_PUBLIC_MORALIS_SERVER_URL")
  };