/**
 * Created by linfaxin on 15/10/17.
 */
///<reference path="../view/ViewConfiguration.ts"/>
///<reference path="../view/animation/Interpolator.ts"/>
///<reference path="../content/res/Resources.ts"/>
///<reference path="../os/SystemClock.ts"/>
///<reference path="../util/Log.ts"/>
///<reference path="../../androidui/util/NumberChecker.ts"/>

module android.widget{
    import ViewConfiguration = android.view.ViewConfiguration;
    import Interpolator = android.view.animation.Interpolator;
    import Resources = android.content.res.Resources;
    import SystemClock = android.os.SystemClock;
    import Log = android.util.Log;
    import NumberChecker = androidui.util.NumberChecker;

    export class OverScroller{
        private mMode = 0;
        private mScrollerX:SplineOverScroller;
        private mScrollerY:SplineOverScroller;
        private mInterpolator:Interpolator;
        private mFlywheel = true;

        static DEFAULT_DURATION = 250;
        static SCROLL_MODE = 0;
        static FLING_MODE = 1;


        constructor(interpolator?:Interpolator, flywheel=true) {
            this.mInterpolator = interpolator;
            this.mFlywheel = flywheel;
            this.mScrollerX = new SplineOverScroller();
            this.mScrollerY = new SplineOverScroller();
        }

        setInterpolator(interpolator:Interpolator):void  {
            this.mInterpolator = interpolator;
        }

        setFriction(friction:number) {
            NumberChecker.warnNotNumber(friction);
            this.mScrollerX.setFriction(friction);
            this.mScrollerY.setFriction(friction);
        }
        isFinished():boolean {
            return this.mScrollerX.mFinished && this.mScrollerY.mFinished;
        }
        forceFinished(finished:boolean) {
            this.mScrollerX.mFinished = this.mScrollerY.mFinished = finished;
        }
        getCurrX():number {
            return this.mScrollerX.mCurrentPosition;
        }
        getCurrY():number {
            return this.mScrollerY.mCurrentPosition;
        }
        getCurrVelocity():number {
            let squaredNorm = this.mScrollerX.mCurrVelocity * this.mScrollerX.mCurrVelocity;
            squaredNorm += this.mScrollerY.mCurrVelocity * this.mScrollerY.mCurrVelocity;
            return Math.sqrt(squaredNorm);
        }
        getStartX():number {
            return this.mScrollerX.mStart;
        }
        getStartY():number {
            return this.mScrollerY.mStart;
        }
        getFinalX():number {
            return this.mScrollerX.mFinal;
        }
        getFinalY():number {
            return this.mScrollerY.mFinal;
        }

        /**
         * Returns how long the scroll event will take, in milliseconds.
         *
         * @return The duration of the scroll in milliseconds.
         *
         * @hide Pending removal once nothing depends on it
         * @deprecated OverScrollers don't necessarily have a fixed duration.
         *             This function will lie to the best of its ability.
         */
        getDuration():number {
            return Math.max(this.mScrollerX.mDuration, this.mScrollerY.mDuration);
        }
        //extendDuration(extend:number) {
        //    this.mScrollerX.extendDuration(extend);
        //    this.mScrollerY.extendDuration(extend);
        //}
        //setFinalX(newX:number) {
        //    this.mScrollerX.setFinalPosition(newX);
        //}
        //setFinalY(newY:number) {
        //    this.mScrollerY.setFinalPosition(newY);
        //}
        computeScrollOffset():boolean {
            if (this.isFinished()) {
                return false;
            }

            switch (this.mMode) {
                case OverScroller.SCROLL_MODE:
                    let time = SystemClock.uptimeMillis();
                    // Any scroller can be used for time, since they were started
                    // together in scroll mode. We use X here.
                    const elapsedTime = time - this.mScrollerX.mStartTime;

                    const duration = this.mScrollerX.mDuration;
                    if (elapsedTime < duration) {
                        let q = (elapsedTime) / duration;

                        if (this.mInterpolator == null) {
                            q = Scroller_viscousFluid(q);
                        } else {
                            q = this.mInterpolator.getInterpolation(q);
                        }

                        this.mScrollerX.updateScroll(q);
                        this.mScrollerY.updateScroll(q);
                    } else {
                        this.abortAnimation();
                    }
                    break;

                case OverScroller.FLING_MODE:
                    if (!this.mScrollerX.mFinished) {
                        if (!this.mScrollerX.update()) {
                            if (!this.mScrollerX.continueWhenFinished()) {
                                this.mScrollerX.finish();
                            }
                        }
                    }

                    if (!this.mScrollerY.mFinished) {
                        if (!this.mScrollerY.update()) {
                            if (!this.mScrollerY.continueWhenFinished()) {
                                this.mScrollerY.finish();
                            }
                        }
                    }

                    break;
            }

            return true;
        }
        startScroll(startX:number, startY:number, dx:number, dy:number, duration=OverScroller.DEFAULT_DURATION) {
            NumberChecker.warnNotNumber(startX, startY, dx, dy, duration);
            this.mMode = OverScroller.SCROLL_MODE;
            this.mScrollerX.startScroll(startX, dx, duration);
            this.mScrollerY.startScroll(startY, dy, duration);
        }
        springBack(startX:number, startY:number, minX:number, maxX:number, minY:number, maxY:number):boolean {
            NumberChecker.warnNotNumber(startX, startY, minX, maxX, minY, maxY);
            this.mMode = OverScroller.FLING_MODE;

            // Make sure both methods are called.
            const spingbackX = this.mScrollerX.springback(startX, minX, maxX);
            const spingbackY = this.mScrollerY.springback(startY, minY, maxY);
            return spingbackX || spingbackY;
        }
        fling(startX:number, startY:number, velocityX:number, velocityY:number,
              minX:number, maxX:number, minY:number, maxY:number, overX=0, overY=0) {
            NumberChecker.warnNotNumber(startX, startY, velocityX, velocityY, minX, maxX, minY, maxY, overX, overY);
            // Continue a scroll or fling in progress
            if (this.mFlywheel && !this.isFinished()) {
                let oldVelocityX = this.mScrollerX.mCurrVelocity;
                let oldVelocityY = this.mScrollerY.mCurrVelocity;
                if (Math_signum(velocityX) == Math_signum(oldVelocityX) &&
                    Math_signum(velocityY) == Math_signum(oldVelocityY)) {
                    velocityX += oldVelocityX;
                    velocityY += oldVelocityY;
                }
            }

            this.mMode = OverScroller.FLING_MODE;
            this.mScrollerX.fling(startX, velocityX, minX, maxX, overX);
            this.mScrollerY.fling(startY, velocityY, minY, maxY, overY);
        }
        notifyHorizontalEdgeReached(startX:number, finalX:number, overX:number) {
            NumberChecker.warnNotNumber(startX, finalX, overX);
            this.mScrollerX.notifyEdgeReached(startX, finalX, overX);
        }
        notifyVerticalEdgeReached(startY:number, finalY:number, overY:number) {
            NumberChecker.warnNotNumber(startY, finalY, overY);
            this.mScrollerY.notifyEdgeReached(startY, finalY, overY);
        }
        isOverScrolled():boolean {
            return ((!this.mScrollerX.mFinished &&
            this.mScrollerX.mState != SplineOverScroller.SPLINE) ||
            (!this.mScrollerY.mFinished &&
            this.mScrollerY.mState != SplineOverScroller.SPLINE));
        }
        abortAnimation() {
            this.mScrollerX.finish();
            this.mScrollerY.finish();
        }
        timePassed():number {
            const time = SystemClock.uptimeMillis();
            const startTime = Math.min(this.mScrollerX.mStartTime, this.mScrollerY.mStartTime);
            return (time - startTime);
        }
        isScrollingInDirection(xvel:number, yvel:number):boolean {
            const dx = this.mScrollerX.mFinal - this.mScrollerX.mStart;
            const dy = this.mScrollerY.mFinal - this.mScrollerY.mStart;
            return !this.isFinished() && Math_signum(xvel) == Math_signum(dx) &&
            Math_signum(yvel) == Math_signum(dy);
        }

    }

    //TODO improve over scroll bounce effect
    class SplineOverScroller{
        static DECELERATION_RATE = (Math.log(0.78) / Math.log(0.9));
        static INFLEXION = 0.35; // Tension lines cross at (INFLEXION, 1)
        static START_TENSION = 0.5;
        static END_TENSION = 1.0;
        static P1 = SplineOverScroller.START_TENSION * SplineOverScroller.INFLEXION;
        static P2 = 1.0 - SplineOverScroller.END_TENSION * (1 - SplineOverScroller.INFLEXION);

        static NB_SAMPLES = 100;
        static SPLINE_POSITION = new Array<number>(SplineOverScroller.NB_SAMPLES + 1);
        static SPLINE_TIME = new Array<number>(SplineOverScroller.NB_SAMPLES + 1);

        static SPLINE = 0;
        static CUBIC = 1;
        static BALLISTIC = 2;

        // Initial position
        mStart = 0;

        // Current position
        mCurrentPosition = 0;

        // Final position
        mFinal = 0;

        // Initial velocity
        mVelocity = 0;

        // Current velocity
        private _mCurrVelocity = 0;
        get mCurrVelocity():number{
            return this._mCurrVelocity;
        }
        set mCurrVelocity(value:number){
            if(!NumberChecker.checkIsNumber(value)){
                value = 0;
            }
            this._mCurrVelocity = value;
        }

        // Constant current deceleration
        mDeceleration = 0;

        // Animation starting time, in system milliseconds
        mStartTime = 0;

        // Animation duration, in milliseconds
        mDuration = 0;

        // Duration to complete spline component of animation
        mSplineDuration = 0;

        // Distance to travel along spline animation
        mSplineDistance = 0;

        // Whether the animation is currently in progress
        mFinished = false;

        // The allowed overshot distance before boundary is reached.
        mOver = 0;

        // Fling friction
        mFlingFriction = ViewConfiguration.getScrollFriction();

        // Current state of the animation.
        mState = SplineOverScroller.SPLINE;

        // Constant gravity value, used in the deceleration phase.
        static GRAVITY = 2000;

        // A context-specific coefficient adjusted to physical values.
        mPhysicalCoeff = 0;

        static _staticFunc = function(){
            let x_min = 0.0;
            let y_min = 0.0;
            for (let i = 0; i < SplineOverScroller.NB_SAMPLES; i++) {
                const alpha = i / SplineOverScroller.NB_SAMPLES;

                let x_max = 1.0;
                let x, tx, coef;
                while (true) {
                    x = x_min + (x_max - x_min) / 2.0;
                    coef = 3.0 * x * (1.0 - x);
                    tx = coef * ((1.0 - x) * SplineOverScroller.P1 + x * SplineOverScroller.P2) + x * x * x;
                    if (Math.abs(tx - alpha) < 1E-5) break;
                    if (tx > alpha) x_max = x;
                    else x_min = x;
                }
                SplineOverScroller.SPLINE_POSITION[i] = coef * ((1.0 - x) * SplineOverScroller.START_TENSION + x) + x * x * x;

                let y_max = 1.0;
                let y, dy;
                while (true) {
                    y = y_min + (y_max - y_min) / 2.0;
                    coef = 3.0 * y * (1.0 - y);
                    dy = coef * ((1.0 - y) * SplineOverScroller.START_TENSION + y) + y * y * y;
                    if (Math.abs(dy - alpha) < 1E-5) break;
                    if (dy > alpha) y_max = y;
                    else y_min = y;
                }
                SplineOverScroller.SPLINE_TIME[i] = coef * ((1.0 - y) * SplineOverScroller.P1 + y * SplineOverScroller.P2) + y * y * y;
            }
            SplineOverScroller.SPLINE_POSITION[SplineOverScroller.NB_SAMPLES] = SplineOverScroller.SPLINE_TIME[SplineOverScroller.NB_SAMPLES] = 1.0;
        }();

        setFriction(friction:number) {
            this.mFlingFriction = friction;
        }

        constructor(){
            this.mFinished = true;
            let ppi = Resources.getDisplayMetrics().density * 160;
            this.mPhysicalCoeff = 9.80665 // g (m/s^2)
                * 39.37 // inch/meter
                * ppi
                * 0.84; // look and feel tuning
        }

        updateScroll(q:number) {
            this.mCurrentPosition = this.mStart + Math.round(q * (this.mFinal - this.mStart));
        }

        static getDeceleration(velocity:number) {
            return velocity > 0 ? -SplineOverScroller.GRAVITY : SplineOverScroller.GRAVITY;
        }


        private adjustDuration(start:number, oldFinal:number, newFinal:number):void {
            let oldDistance = oldFinal - start;
            let newDistance = newFinal - start;
            let x = Math.abs(newDistance / oldDistance);
            let index = Number.parseInt(<any>(SplineOverScroller.NB_SAMPLES * x));
            if (index < SplineOverScroller.NB_SAMPLES) {
                let x_inf = index / SplineOverScroller.NB_SAMPLES;
                let x_sup = (index + 1) / SplineOverScroller.NB_SAMPLES;
                let t_inf = SplineOverScroller.SPLINE_TIME[index];
                let t_sup = SplineOverScroller.SPLINE_TIME[index + 1];
                let timeCoef = t_inf + (x - x_inf) / (x_sup - x_inf) * (t_sup - t_inf);
                this.mDuration *= timeCoef;
            }
        }

        startScroll(start:number, distance:number, duration:number) {
            this.mFinished = false;

            this.mStart = start;
            this.mFinal = start + distance;

            this.mStartTime = SystemClock.uptimeMillis();
            this.mDuration = duration;

            // Unused
            this.mDeceleration = 0;
            this.mVelocity = 0;
        }

        finish() {
            this.mCurrentPosition = this.mFinal;
            this.mFinished = true;
        }

        setFinalPosition(position:number) {
            this.mFinal = position;
            this.mFinished = false;
        }

        extendDuration(extend:number) {
            let time = SystemClock.uptimeMillis();
            let elapsedTime = (time - this.mStartTime);
            this.mDuration = elapsedTime + extend;
            this.mFinished = false;
        }

        springback(start:number, min:number, max:number):boolean {
            this.mFinished = true;

            this.mStart = this.mFinal = start;
            this.mVelocity = 0;

            this.mStartTime = SystemClock.uptimeMillis();
            this.mDuration = 0;

            if (start < min) {
                this.startSpringback(start, min, 0);
            } else if (start > max) {
                this.startSpringback(start, max, 0);
            }

            return !this.mFinished;
        }
        startSpringback(start:number, end:number, velocity:number) {
            // mStartTime has been set
            this.mFinished = false;
            this.mState = SplineOverScroller.CUBIC;
            this.mStart = start;
            this.mFinal = end;
            const delta = start - end;
            this.mDeceleration = SplineOverScroller.getDeceleration(delta);
            // TODO take velocity into account
            this.mVelocity = -delta; // only sign is used
            this.mOver = Math.abs(delta);
            this.mDuration = (1000.0 * Math.sqrt(-2.0 * delta / this.mDeceleration));
        }

        fling(start:number, velocity:number, min:number, max:number, over:number) {
            this.mOver = over;
            this.mFinished = false;
            this.mCurrVelocity = this.mVelocity = velocity;
            this.mDuration = this.mSplineDuration = 0;
            this.mStartTime = SystemClock.uptimeMillis();
            this.mCurrentPosition = this.mStart = start;

            if (start > max || start < min) {
                this.startAfterEdge(start, min, max, velocity);
                return;
            }

            this.mState = SplineOverScroller.SPLINE;
            let totalDistance = 0.0;

            if (velocity != 0) {
                this.mDuration = this.mSplineDuration = this.getSplineFlingDuration(velocity);
                totalDistance = this.getSplineFlingDistance(velocity);
            }

            this.mSplineDistance = (totalDistance * Math_signum(velocity));
            this.mFinal = start + this.mSplineDistance;

            // Clamp to a valid final position
            if (this.mFinal < min) {
                this.adjustDuration(this.mStart, this.mFinal, min);
                this.mFinal = min;
            }

            if (this.mFinal > max) {
                this.adjustDuration(this.mStart, this.mFinal, max);
                this.mFinal = max;
            }
        }

        getSplineDeceleration(velocity:number):number {
            return Math.log(SplineOverScroller.INFLEXION * Math.abs(velocity) / (this.mFlingFriction * this.mPhysicalCoeff));
        }

        getSplineFlingDistance(velocity:number):number {
            let l = this.getSplineDeceleration(velocity);
            let decelMinusOne = SplineOverScroller.DECELERATION_RATE - 1.0;
            return this.mFlingFriction * this.mPhysicalCoeff * Math.exp(SplineOverScroller.DECELERATION_RATE / decelMinusOne * l);
        }
        getSplineFlingDuration(velocity:number):number {
            let l = this.getSplineDeceleration(velocity);
            let decelMinusOne = SplineOverScroller.DECELERATION_RATE - 1.0;
            return (1000.0 * Math.exp(l / decelMinusOne));
        }

        fitOnBounceCurve(start:number, end:number, velocity:number) {
            // Simulate a bounce that started from edge
            let durationToApex = - velocity / this.mDeceleration;
            let distanceToApex = velocity * velocity / 2.0 / Math.abs(this.mDeceleration);
            let distanceToEdge = Math.abs(end - start);
            let totalDuration = Math.sqrt(
            2.0 * (distanceToApex + distanceToEdge) / Math.abs(this.mDeceleration));
            this.mStartTime -= (1000 * (totalDuration - durationToApex));
            this.mStart = end;
            this.mVelocity = (- this.mDeceleration * totalDuration);
        }
        startBounceAfterEdge(start:number, end:number, velocity:number) {
            this.mDeceleration = SplineOverScroller.getDeceleration(velocity == 0 ? start - end : velocity);
            this.fitOnBounceCurve(start, end, velocity);
            this.onEdgeReached();
        }
        startAfterEdge(start:number, min:number, max:number, velocity:number) {
            if (start > min && start < max) {
                Log.e("OverScroller", "startAfterEdge called from a valid position");
                this.mFinished = true;
                return;
            }
            const positive = start > max;
            const edge = positive ? max : min;
            const overDistance = start - edge;
            let keepIncreasing = overDistance * velocity >= 0;
            if (keepIncreasing) {
                // Will result in a bounce or a to_boundary depending on velocity.
                this.startBounceAfterEdge(start, edge, velocity);
            } else {
                const totalDistance = this.getSplineFlingDistance(velocity);
                if (totalDistance > Math.abs(overDistance)) {
                    this.fling(start, velocity, positive ? min : start, positive ? start : max, this.mOver);
                } else {
                    this.startSpringback(start, edge, velocity);
                }
            }
        }

        notifyEdgeReached(start:number, end:number, over:number) {
            // mState is used to detect successive notifications
            if (this.mState == SplineOverScroller.SPLINE) {
                this.mOver = over;
                this.mStartTime = SystemClock.uptimeMillis();
                // We were in fling/scroll mode before: current velocity is such that distance to
                // edge is increasing. This ensures that startAfterEdge will not start a new fling.
                this.startAfterEdge(start, end, end, this.mCurrVelocity);
            }
        }

        onEdgeReached() {
            // mStart, mVelocity and mStartTime were adjusted to their values when edge was reached.
            let distance = this.mVelocity * this.mVelocity / (2 * Math.abs(this.mDeceleration));
            const sign = Math_signum(this.mVelocity);

            if (distance > this.mOver) {
                // Default deceleration is not sufficient to slow us down before boundary
                this.mDeceleration = - sign * this.mVelocity * this.mVelocity / (2.0 * this.mOver);
                distance = this.mOver;
            }

            this.mOver = distance;
            this.mState = SplineOverScroller.BALLISTIC;
            this.mFinal = this.mStart + (this.mVelocity > 0 ? distance : -distance);
            this.mDuration = - (1000 * this.mVelocity / this.mDeceleration);
        }

        continueWhenFinished():boolean {
            switch (this.mState) {
                case SplineOverScroller.SPLINE:
                    // Duration from start to null velocity
                    if (this.mDuration < this.mSplineDuration) {
                        // If the animation was clamped, we reached the edge
                        this.mStart = this.mFinal;
                        // TODO Better compute speed when edge was reached
                        this.mVelocity = this.mCurrVelocity;
                        this.mDeceleration = SplineOverScroller.getDeceleration(this.mVelocity);
                        this.mStartTime += this.mDuration;
                        this.onEdgeReached();
                    } else {
                        // Normal stop, no need to continue
                        return false;
                    }
                    break;
                case SplineOverScroller.BALLISTIC:
                    this.mStartTime += this.mDuration;
                    this.startSpringback(this.mFinal, this.mStart, 0);
                    break;
                case SplineOverScroller.CUBIC:
                    return false;
            }

            this.update();
            return true;
        }

        update():boolean {
            const time = SystemClock.uptimeMillis();
            const currentTime = time - this.mStartTime;

            if (currentTime > this.mDuration) {
                return false;
            }

            let distance = 0;
            switch (this.mState) {
                case SplineOverScroller.SPLINE: {
                    const t = currentTime / this.mSplineDuration;
                    const index = Math.floor(SplineOverScroller.NB_SAMPLES * t);
                    let distanceCoef = 1;
                    let velocityCoef = 0;
                    if (index < SplineOverScroller.NB_SAMPLES) {
                        const t_inf = index / SplineOverScroller.NB_SAMPLES;
                        const t_sup = (index + 1) / SplineOverScroller.NB_SAMPLES;
                        const d_inf = SplineOverScroller.SPLINE_POSITION[index];
                        const d_sup = SplineOverScroller.SPLINE_POSITION[index + 1];
                        velocityCoef = (d_sup - d_inf) / (t_sup - t_inf);
                        distanceCoef = d_inf + (t - t_inf) * velocityCoef;
                    }

                    distance = distanceCoef * this.mSplineDistance;
                    this.mCurrVelocity = velocityCoef * this.mSplineDistance / this.mSplineDuration * 1000;
                    break;
                }

                case SplineOverScroller.BALLISTIC: {
                    const t = currentTime / 1000;
                    this.mCurrVelocity = this.mVelocity + this.mDeceleration * t;
                    distance = this.mVelocity * t + this.mDeceleration * t * t / 2;
                    break;
                }

                case SplineOverScroller.CUBIC: {
                    const t = (currentTime) / this.mDuration;
                    const t2 = t * t;
                    const sign = Math_signum(this.mVelocity);
                    distance = sign * this.mOver * (3 * t2 - 2 * t * t2);
                    this.mCurrVelocity = sign * this.mOver * 6 * (- t + t2);
                    break;
                }
            }

            this.mCurrentPosition = this.mStart + Math.round(distance);

            return true;
        }

    }


    function Math_signum(value:number):number{
        if(value === 0 || Number.isNaN(value)) return value;
        return Math.abs(value)===value ? 1 : -1;
    }

    let sViscousFluidScale = 8;
    // must be set to 1.0 (used in viscousFluid())
    let sViscousFluidNormalize = 1;
    function Scroller_viscousFluid(x:number):number{
        x *= sViscousFluidScale;
        if (x < 1) {
            x -= (1 - Math.exp(-x));
        } else {
            let start = 0.36787944117;   // 1/e == exp(-1)
            x = 1 - Math.exp(1 - x);
            x = start + x * (1 - start);
        }
        x *= sViscousFluidNormalize;
        return x;
    }
    sViscousFluidNormalize = 1 / Scroller_viscousFluid(1);
}