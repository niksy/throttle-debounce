declare module 'throttle-debounce' {
  export declare function throttle<T extends (...args: any[]) => any>(
    delay: number,
    noTrailing: boolean,
    callback?: T,
    debounceMode?: boolean
  );

  export declare function debounce<T extends (...args: any[]) => any>(
    delay: number,
    atBegin: boolean,
    callback?: T
  );
}
